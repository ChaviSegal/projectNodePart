

import express from "express";
import productRouter from './routs/product.js'
import orderRouter from './routs/order.js'
import userRouter from './routs/user.js'
import { connectToDB } from "./db/connectToDb.js"
import { config } from "dotenv";
import cors from "cors";
import { errorHandling } from "./middlewares/errorHandling.js";

const printDate = (req, res, next) => {
    console.log("a new request in", Date.now())
    next()
}

const addData = (req, res, next) => {
    req.xxx = { name: "diza" };
    next();

}
const app = express();

// app.use("/api/course", printDate)
// app.use(addData)
// app.get("ap/course",printDate)
app.use(cors())
app.use(express.json());

connectToDB();
config();


// app.get("/api/all/:name")
// app.use("api/all", express.static("files"))
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use(errorHandling)

let port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
   // / api / all / picture2.jpg