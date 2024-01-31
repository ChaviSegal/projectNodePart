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
    PictureRouting: String,
    domain: String
})

export const productModel = mongoose.model("products", productSchema)

export const productValidator = (_product) => {
    const productValidationSchema = Joi.object().keys({
        _id: Joi.number(),
        productName: Joi.string().min(3).max(5).required(),
        descripttion:Joi.string(),
        ManufacturingDate:Joi.string(),
        PictureRouting:Joi.string(),
        domain:Joi.string()
    })
    return productValidationSchema.validate(_product);
}

