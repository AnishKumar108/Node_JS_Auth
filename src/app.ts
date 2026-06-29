import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"




const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health",(_req,res) => {
    res.send({success:true})
})

app.use("/auth",authRoutes)
app.use("/user",userRoutes);
app.use("/admin",adminRoutes)

export default app;