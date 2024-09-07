import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("uri", uri);
mongoose.connect(uri).then(() => {
    console.log('Connected to Database');
}).catch((err) => {
    console.log('Failed to connect to Database');
    console.log(err); 
});