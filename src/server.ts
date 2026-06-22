import dotenv from "dotenv";
import app from "./app.js";
import { connectToDb } from "./config/db.js";


dotenv.config()

async function startServer(){
    app.listen(process.env.PORT,() => {
        console.log("Server is running on port 5000")
    })

    await connectToDb()
}


startServer().catch(error => {
    console.log("Error while starting the server",error);
    process.exit(1)
})
