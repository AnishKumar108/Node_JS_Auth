import mongoose from "mongoose";


export async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Monogo db connection established Successfully")
    }
    catch(error){
        console.error("Mongo db connection error",error);
        process.exit(1)
    }
}