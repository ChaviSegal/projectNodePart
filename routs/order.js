import express from "express";
import { addOrder, getAllOrders, getOrderById, deleteOrder, updateOrder, getAllOrdersByOrderer } from "../controllers/order.js";
import { auth, authAdmin } from "../db/auth.js";

const router = express.Router();

router.get("/",getAllOrders);
router.get("/ordersByOrderer", auth, getAllOrdersByOrderer);
router.get("/:id", getOrderById);
router.delete("/:id", auth, authAdmin, deleteOrder);
router.post("/", auth, addOrder);
router.put("/:id", authAdmin, updateOrder);

export default router;