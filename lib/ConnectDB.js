import mongoose from "mongoose";

export async function dbConnect() {
    
    try {
    await mongoose.connect(process.env.MONGODB_URI);
    // console.log('connect success');
    } catch (error) {
        console.log("Connection to database failed ", error);
    }

}