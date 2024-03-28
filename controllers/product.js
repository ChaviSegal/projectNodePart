import { productModel, productValidator } from "../models/product.js";
import mongoose from "mongoose";


export const getAllProducts = async (req, res, next) => {
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 12; // הערך נקבע להיות 
    try {
        let allProducts = await productModel.find({
            $or:
                [{ productName: txt }, { description: txt }, { productName: txt }, { category: txt }]
        }).select('productName descripttion PictureRouting category price ')
            .skip((page - 1) * perPage).limit(perPage);
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
            return res.status(400).json({ type: "no id", messege: "error" })
            //     res.status(400);
            //     throw new Error('קוד לא הגיוני')
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
    let { _id, productName, descripttion, ManufacturingDate, PictureRouting, domain, category, compani, price } = req.body;

    if (!productName)
        return res.status(404).json({ type: "missing params", message: "missing details: id or productName or supplierId" })

    const errors = await productValidator(req.body);
    console.log(errors)
    try {

        let sameProduct = await productModel.findOne({ _id: _id });
        if (sameProduct)
            return res.status(409).json({ type: "same details", message: "there is already same product" })
        let newProduct = new productModel({ userId: req.user._id, productName, descripttion, ManufacturingDate, PictureRouting, domain, category, compani, price });
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

export const getProductByCategory = async (req, res) => {
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;
    let { category } = req.params;

    try {
        let product = await productModel
            .find({ category: category })
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (!product || product.length === 0) {
            return res.status(404).json({
                type: "not found",
                message: "No product with such description",
            });
        }

        return res.json(product);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            type: "invalid operation",
            message: "Sorry, cannot get product",
        });
    }
};

export const countProducts = async (req, res) => {
    let { category } = req.params;
    try {
      let products = await productModel.find({ category: category });
      let cnt = products.length; // Get the number of objects in the collection
      res.json({ count: cnt });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error counting products" });
    }
  };