import Joi from "joi";
import mongoose from "mongoose";
import { productSchema } from "./product.js";



 const minimalProductSchema = mongoose.Schema({
    productName: String,
    productAmont: Number
})
// export const minimalProductModel = mongoose.model("minimalProduct", minimalProductSchema)


export const orderSchema = mongoose.Schema({
    orderDate: Date,
    getOrderDate: Date,
    orderAdress: String,
    products: [minimalProductSchema],
    ordererId: String,
    didOrderGoOutAlredy: {type: Boolean, default: "false"}
})



export const orderModel = mongoose.model("orders", orderSchema)

export const orderValidator = (_order) => {
    const orderValidationSchema = Joi.object().keys({
        orderDate: Joi.date(),
        getOrderDate: Joi.date(),
        orderAdress: Joi.string(),
        products: Joi.array(),
        odererId: Joi.string(),
        didOrderGoOutAlredy: Joi.boolean()
    })
    return orderValidationSchema.validate(_order);
}