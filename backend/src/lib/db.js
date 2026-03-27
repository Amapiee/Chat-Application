import mongoose from 'mongoose';

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to MongoDB: " + conn.connection.host);
    }
    catch(error){
        console.log("Error connecting to MongoDB: " + error.message);
    }
}