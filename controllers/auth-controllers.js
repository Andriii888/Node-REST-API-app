import { HttpError } from "../helpers/HttpError.js";
import { User, schemes } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const { SECRET_KEY } = process.env;

export const ctrlRegisterUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = schemes.registerScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({ name: result.name, email: result.email });
};

export const ctrlLoginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "email or password wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "email or password invalid");
  }
  const payload = {id:user._id,};

  const token = jwt.sign(payload,SECRET_KEY,{expiresIn:"23h"});
  res.json({ token });
};

export const ctrlGetCurrent = async (req,res)=>{
  const {name,email}=req.user;
  res.json({name,email})
}
