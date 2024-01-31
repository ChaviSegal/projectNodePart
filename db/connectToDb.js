import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        let connect = await mongoose.connect(process.env.DB_URI||"mongodb+srv://cs0548417893:214377087@nodeproject.6xnfjsl.mongodb.net/")
        console.log("mongo db connected")
    }
    catch (err) {
        console.log(err);
        console.log("cannot connect to db");
        process.exit(1)
    }
}