import {Request,Response,NextFunction} from "express"

 function reqRole(role : "user" | "admin"){
    return (req:Request,res:Response,next:NextFunction) => {
        const reqAuth = req as any;
        const reqUser = reqAuth.user;

        if(!reqUser){
            return res.status(401).json({message:"You are not authentic user !!"})
        }

        if(reqUser.role !== role){
            return res.status(403).json({message:"You are not authorize to access this route"})
        }

        next()
    }
}

export default reqRole