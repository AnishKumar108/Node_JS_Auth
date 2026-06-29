import {Router} from "express";
import {Request,Response} from "express";
import {User} from "../models/user.model.js";
import reqAuth from "../midddlewares/auth.middleware.js";
import reqRole from "../midddlewares/role.middleware.js"

const router = Router();

router.get("/users",reqAuth,reqRole("admin"),async(_req:Request,res:Response) => {
        const users = await User.find({},{email:1,role:1,name:1});

        return res.status(200).json({users});

})

export default router;