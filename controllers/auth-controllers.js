import { HttpError } from "../helpers/HttpError.js";
import { User, schemes } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path'; 
import * as url from 'url';
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const avatarsDir= path.join(__dirname,"../","public","avatars");

dotenv.config();

const { SECRET_KEY } = process.env;

export const ctrlRegisterUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = schemes.registerScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const result = await User.create({ ...req.body, password: hashPassword ,avatarURL});
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
  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

export const ctrlGetCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
};

export const ctrlLogOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "LogOut success" });
};

export const ctrlSubscription = async (req, res) => {
  const { error } = schemes.subscriptionScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { subscription } = req.body;
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { subscription });

  if (!result) {
    throw HttpError(404, `User with id ${_id} not found:(`);
  }
  res.json(result);
};

export const ctrlUpdateAvatar = async (req,res)=>{
const {_id}= req.user;
const {path:tempUpload,filename}=req.file;
const avatarName= `${_id}_${filename}`;
const resultUpload= path.join(avatarsDir,avatarName);
await fs.rename(tempUpload,resultUpload);
const avatarURL=path.join("avatars",avatarName);
await User.findByIdAndUpdate(_id,{avatarURL});
res.json({avatarURL});
};
