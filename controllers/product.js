import { productModel, productValidator } from "../models/product.js";
import mongoose from "mongoose";


export const getAllProducts = async (req, res, next) => {

    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;
    // if(req.xxx)

    try {

        let allProducts = await productModel.find({
            $or:
                [{ productName: txt }, { description: txt }]
        }).skip((page - 1) * perPage).limit(perPage);
        //pagination
        res.json(allProducts)
    }

    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get products" })
    }
}

export const getProductById = async (req, res) => {
    let { id } = req.params;

    try {
        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error('קוד לא הגיוני')
        }
        // return res.status(400).json({ type: "not valid id", message: "id not in right format" })

        let product = await productModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "no id", message: "no product with such id" })
        return res.json(product)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}

export const deleteProduct = async (req, res) => {
    let { id } = req.params;

    // if (!id)
    //     return res.status(404).json({ type: "missing params", message: "missing details in body: name or domain" })

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id not in right format" })

        let product = await productModel.findByIdAndDelete(id);

        if (!product)
            return res.status(404).json({ type: "no product to delete", message: "no product with such id to delete" })

        // if (req.user.role != "ADMIN")
        //     res.status(403).json({
        //         type: "you are not allowed", message: "you are not allowed to delete a product"
        //     })

        product = await productModel.findByIdAndDelete(id);
        return res.json(product)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}

export const addProduct = async (req, res) => {
    let { productName, descripttion, ManufacturingDate, PictureRouting, domain, id } = req.body;

    if (!descripttion)
        return res.status(404).json({ type: "missing params", message: "missing details in body: name " })

    const result = await productValidator(req.body);
    console.log(result)
    if (result.errors)
        return res.status(400).json({ type: " invalid data", message: result.errors.details[0].message })

    try {
        let sameProduct = await productModel.findOne({ descripttion: descripttion });
        if (sameProduct)
            return res.status(409).json({ type: "same details", message: "there is already same product" })

        // if (req.user.role != "ADMIN")
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to add a product" })

        let newProduct = new productModel({
            productName, descripttion, ManufacturingDate, PictureRouting, domain,
            userId: req.user._id
        });
        await newProduct.save();
        return res.json(newProduct)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }

}


export const updateProduct = async (req, res) => {

    let { id } = req.params;
    // if (!id)
    // return res.status(404).json({ type: "missing params", message: "missing details in body: id" })

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })

    try {
        let product = await productModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "product not found", message: "no product with such id" })
        // let { name, numLessons, startDate, tags, speaker, price } = req.body;

        // course.name = name || course.name;
        // course.price = price || course.price;
        // course.speaker = speaker || course.speaker;
        // course.numLessons = numLessons || course.numLessons;
        // course.startDate = startDate || course.startDate;
        // course.tags = tags || course.tags;

        // await course.save();

        // if (req.user.role != "ADMIN")
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to delete a product" })

        let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true })

        return res.json(updatedProduct);
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}