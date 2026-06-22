import cookieParser from "cookie-parser";
import express from "express";




const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health",(_req,res) => {
    res.send({success:true})
})

export default app;