import {Router} from "express";
import { loginHandler, registerHandler, verifyEmailHandler } from "../controllers/auth/auth.controller.js";


const router = Router();

router.post("/register",registerHandler);
router.get("/verify-token",verifyEmailHandler)
router.post("/login",loginHandler)

export default router;