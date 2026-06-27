import {Router} from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler, verifyEmailHandler } from "../controllers/auth/auth.controller.js";


const router = Router();

router.post("/register",registerHandler);
router.get("/verify-token",verifyEmailHandler)
router.post("/login",loginHandler);
router.post("/refresh",refreshHandler);
router.post("/logout",logoutHandler)

export default router;