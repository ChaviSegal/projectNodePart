import mongoose from "mongoose";
import Joi from "joi";


// const doubtSchema = mongoose.Schema({
//     id:Number,
//     doubtName: String
// }) 

export const productSchema = mongoose.Schema({
    productName: String,
    descripttion: String,
    ManufacturingDate: Date,
    PictureRouting: [String],
    domain: String,
    category: String,
    compani: String,
    price: Number
})

export const productModel = mongoose.model("products", productSchema)

export const productValidator = (_product) => {
    const productValidationSchema = Joi.object().keys({
        price: Joi.number(),
        productName: Joi.string(),
        descripttion: Joi.string(),
        ManufacturingDate: Joi.string(),
        domain: Joi.string(),
        category: Joi.string(),
        compani: Joi.string()
    })
    return productValidationSchema.validate(_product);
}

