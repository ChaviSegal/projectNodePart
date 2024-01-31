import mongoose from "mongoose";
import { orderModel } from "../models/order.js"

//params חובה /api/course/1
//queryparams אופציונלים /api/course?txt=a
export const getAllOrders = async (req, res, next) => {

    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    // if(req.xxx)
    try {
        // if (order.ordererId != req.user._id)
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to see all the orders" })
        let allOrders = await orderModel.find({
            // $or:
            //     [{ orderAdress: txt }]
        }).skip((page - 1) * perPage).limit(perPage);
        //pagination
        return res.json(allOrders)

    }
    catch (err) {
         res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}

export const getAllOrdersByOrderer = async (req, res, next) => {
    let ordererId=req.user._id;
    
    
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    // if(req.xxx)
    try {
        // if (order.ordererId != req.user._id)
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to see all the orders" })
        // let allOrders = await orderModel.find({
        //     $or:
        //         [{ ordererId: req.user._id }]
        // }).skip((page - 1) * perPage).limit(perPage);
        //pagination
        let allOrders = await orderModel.find({ordererId})
        return res.json(allOrders)

    }
    catch (err) {
         res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}



export const getOrderById = async (req, res) => {
    let { id } = req.params;
    try {
        // if (!mongoose.isValidObjectId(id)) {
        //     res.status(400);
        //     throw new Error('קוד לא הגיוני')
        // }
        // return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: "no id", message: "no order with such id" })
        return res.json(order)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get order" })
    }

}


export const deleteOrder = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))

            return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let order = await orderModel.findByIdAndDelete(id);
        if (!order)
            return res.status(404).json({ type: "no order to delete", message: "no order with such id to delete" })

        order = await orderModel.findById(id);    
        // if (req.user.role != "ADMIN" && order.ordererId != req.user._id)
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to delete a product" })

        if (order.didOrderGoOutAlredy == "true")
            res.status(403).json({ type: "the order cant be canceled", message: "the order is already on the way" })

        order = await orderModel.findByIdAndDelete(id);

        return res.json(order)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get order" })
    }

}

export const addOrder = async (req, res) => {
    let { orderDate, getOrderDate,  orderAdress, products } = req.body;

    if (!orderAdress)
        return res.status(404).json({ type: "missing params", message: "missing details in body: orderAdress " })

    // const result = await orderValidator(req.body);
    // console.log(result)
    // if (result.errors)
    //     return res.status(400).json({ type: " invalid data", message: result.errors.details[0].message })

    try {
        // let sameProduct = await productModel.findOne({ descripttion: descripttion });
        // if (sameProduct)
        //     return res.status(409).json({ type: "same details", message: "there is already same product" })

        // if (req.user.role != "ADMIN")
        //     res.status(403).json({ type: "you are not allowed", message: "you are not allowed to add a product" })

        let newOrder = new orderModel({orderDate, getOrderDate,  orderAdress, products, ordererId: req.user._id
        });
        await newOrder.save();
        return res.json(newOrder)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot add order" })
    }

}




// export const addOrder = async (req, res) => {
//     let { orderDate, getOrderDate,  orderAdress, products } = req.body;

//     if (!orderAdress )
//         return res.status(404).json({ type: "missing params", message: "missing details in body orderAdress or products" })

//     try {

//         let newOrder = new orderModel({ orderDate, getOrderDate,  orderAdress, products, ordererId: req.user._id });
//         await newOrder.save();

//         return res.json(newOrder)

//     }
//     catch (err) {
//         console.log(err)
//         res.status(400).json({ type: "invalid operation", message: "sorry cannot post order" })
//     }

// }


export const updateOrder = async (req, res) => {

    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)){
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    }

    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: "order not found", message: "no order with such id" })
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

        let updated = await orderModel.findByIdAndUpdate(id, { didOrderGoOutAlredy: true });
        return res.json(updated);

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get order" })
    }

}