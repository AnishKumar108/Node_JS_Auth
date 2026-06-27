import { comparePassword, hashPassword } from "../../lib/hash.js";
import { sendEmail } from "../../lib/mail.js";
import { generateAccessToken, generateRefreshToken } from "../../lib/token.js";
import { User } from "../../models/user.model.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"

function getAppUrl(){
    return process.env.APP_URL || `http://localhost:${process.env.PORT}`
}

export async function registerHandler(req:Request,res:Response){
    try{
        const response = registerSchema.safeParse(req.body);
        if(!response.success){
            return res.status(400).json({
                message:"Invalid request body",
                errors:response.error.flatten()
            })
        }
        
        const {email,password,name} = response.data
        const userEmail = email.toLowerCase().trim();

        const existingEmail = await User.findOne({email:userEmail});
        if(existingEmail){
            return res.status(409).json({
                message:"Email already exists,Please provide another email"
            })
        }

        const passwordHash = await hashPassword(password);

        const userResponse = await User.create({
            name,
            email:userEmail,
            passwordHash,
            isEmailVerified:false,
            twoFactorEnabled:false
        })
         
        // Email verification part

        const verifyToken =  jwt.sign({sub:userResponse.id},process.env.JWT_ACCESS_SECRET!,{expiresIn:"1d"});

        const verifyUrl = `${getAppUrl()}/auth/verify-token?token=${verifyToken}`;

        await sendEmail(userResponse.email,"Verify your Email",
            `<p>Verify your email using this link :</p>
              <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
            
        );

        return res.status(201).json({
            message:"User created Successfully",
            data:{
                name:userResponse.name,
                email:userResponse.email,
                password:userResponse.passwordHash,
                isEmailVerified:userResponse.isEmailVerified
            }
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error",
            error:err
        })
    }
}


export async function verifyEmailHandler(req:Request,res:Response){
    const token = req.query.token as string | undefined;

    if(!token){
        return res.status(400).json({message:"Token not provided"})
    }

    try{
        const payload = await jwt.verify(token,process.env.JWT_ACCESS_SECRET!) as {sub: string}
        
        const response = await User.findById(payload.sub);
        if(!response){
            return res.status(400).json({message:"User doesn't exist"})
        }

        if(response.isEmailVerified){
            return res.status(400).json({message:"Email is already verified"})
        }

        response.isEmailVerified = true;
        await response.save();

        return res.status(200).json({message:"Email verified successfully !! You can login now!!"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function loginHandler(req:Request,res:Response){
    try{
        const response =  loginSchema.safeParse(req.body);

        if(!response.success){
            return res.status(400).json({message:"Invalid User credentials",errors:response.error.flatten()})
        }

        const {email,password} = response.data
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({email:normalizedEmail});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const correctPass = await comparePassword(password,user.passwordHash);
        
        if(!correctPass){
            return res.status(400).json({message:"Invalid email or password"})
        };

        if(!user.isEmailVerified){
            return res.status(403).json({message:"Email is not verified , please verify your email"})
        }

        const accessToken = await generateAccessToken(user.id,user.role,user.tokenVersion) 

        const refreshToken = await generateRefreshToken(user.id,user.tokenVersion);

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:isProd,
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json({message:"You are logged in successfully....",
            accessToken,
            user:{
                id:user.id,
                email:user.email,
                isEmailVerified:user.isEmailVerified,
                twoFactorEnabled:user.twoFactorEnabled,
                role:user.role
            }
        })



    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server error"})
    }
}