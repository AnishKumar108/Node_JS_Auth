import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js"




const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health",(_req,res) => {
    res.send({success:true})
})

app.use("/auth",authRoutes)

export default app;