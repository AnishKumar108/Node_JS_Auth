import jwt from "jsonwebtoken";

export async function generateAccessToken (userId:string,role:"user"|"admin",tokenVersion:number){
    const payload = {sub:userId,role,tokenVersion};

    return await jwt.sign(payload,process.env.JWT_ACCESS_SECRET!,{expiresIn:"30m"})
}

export async function generateRefreshToken (userId:string,tokenVersion:number){
    const payload = {sub:userId,tokenVersion};

    return await jwt.sign(payload,process.env.JWT_REFRESH_SECRET!,{expiresIn:"7d"})
}

export async function verifyRefreshToken(token:string){
    return  jwt.verify(token,process.env.JWT_REFRESH_SECRET!) as {sub:string,tokenVersion:number}
}