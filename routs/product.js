import express from "express";
import { addProduct, getAllProducts, getProductById, deleteProduct, updateProduct, getProductByCategory, countProducts } from "../controllers/product.js";
import { auth,authAdmin } from "../db/auth.js";


const router = express.Router();

router.get("/",getAllProducts);
router.get("/:id", getProductById);
router.get("/:category", getProductByCategory);
router.delete("/:id", authAdmin,deleteProduct);
router.post("/", authAdmin, addProduct);
router.put("/:id", authAdmin,updateProduct);
router.get("/category/:category", getProductByCategory);
router.get("/count/:category",countProducts );

export default router;