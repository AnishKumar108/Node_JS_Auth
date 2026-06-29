import {Router} from "express";
import {Request,Response} from "express"
import reqAuth from "../midddlewares/auth.middleware.js"

const router = Router();

router.get("/me",reqAuth,(req:Request,res:Response)=>{
    const reqAuth = req as any;
    const reqUser = reqAuth.user;

    return res.status(200).json({
        user:reqUser
    })
})

export default router;