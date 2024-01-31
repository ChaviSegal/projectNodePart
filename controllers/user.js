import { generateToken, userModel, userValidator } from "../models/user.js";
import bcrypt from "bcryptjs";

export const addUser = async (req, res) => {
    let { userName, password, email } = req.body;

    if (!userName || !password || !email)
        return res.status(404).json({ type: "missing parameters", message: "please send email user name and password" })

    // const errors = await userValidator(req.body);
    // console.log(errors)

    try {
        const sameUser = await userModel.findOne({ email: email });
        if (sameUser)
            return res.status(409).json({ type: "same user", message: "user with such email already exists" })
        let hashedPassword = await bcrypt.hash(password, 15);
        let newUser = new userModel({ email, password: hashedPassword, userName, role: "USER" });
        await newUser.save();
        let token = generateToken(newUser._id, newUser.role, newUser.userName);
        res.json({ _id: newUser.id, userName: newUser.userName, token, email: newUser.email })
    }

    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "cannot add user" })
    }
}

export const login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password)
        return res.status(404).json({ type: "missing parameters", message: "please send email user name and password" })

    try {
        const user = await userModel.findOne({ email: email });
        if (!user)
            return res.status(404).json({ type: "no  user", message: "one or more details are invalid" })

        if (! await bcrypt.compare(password, user.password))
            return res.status(404).json({ type: "no  user", message: "user password is invalid" })

        user.password = "****";
        let token = generateToken(user._id, user.role, user.userName)
        console.log("hhh");

        return res.json({ _id: user.id, userName: user.userName, token, email: user.email })
    }
    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "cannot sign in user" })
    }
}

export const getAllUsers = async (req, res) => {

    try {

        let allUsers = await userModel.find({}, "-password");
        return res.json(allUsers);

    } catch (err) {
        return res.status(400).json({ type: "invalid operation", message: "cannot sign in user" })
    }
}