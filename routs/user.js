import express from "express";
import { addUser, getAllUsers, login } from "../controllers/user.js";
import { auth, authAdmin } from "../db/auth.js";


const router = express.Router();

router.get("/", authAdmin,getAllUsers);
router.post("/", addUser);
router.post("/login", auth,login);


export default router;