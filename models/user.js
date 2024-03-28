import mongoose from "mongoose";
import Joi from "joi";
import  Jwt  from "jsonwebtoken";

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: { type: String, unique: true },
    role: {type: String, default: "user"},
    joinDate: String
})

export const userModel = mongoose.model("users", userSchema)

export const userValidator = (_user) => {
    const userValidationSchema = Joi.object().keys({
        userName: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string(),
        role: Joi.string(),
        joinDate: Joi.string()
    })
    return userValidationSchema.validate(_user);
}

export const generateToken = (_id, role, userName) => {
    let token=Jwt.sign({_id, userName, role},
        process.env.SECRET_JWT, {
            expiresIn: "2h"
        })
        return token;
}