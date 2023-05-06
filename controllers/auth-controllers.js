import { HttpError } from "../helpers/HttpError.js";
import { User, schemes } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import Jimp from "jimp";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/sendEmail.js";

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;

export const ctrlRegisterUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = schemes.registerScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();
  console.log(verificationToken);
  console.log(email);

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a targer="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click me to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({ name: result.name, email: result.email });
};

export const ctrlLoginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or Password wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

export const ctrlUpdateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  await Jimp.read(tempUpload)
    .then((image) => {
      image.resize(250, 250);
      image.write(tempUpload);
    })
    .catch((err) => {
      console.log(err);
    });

  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, avatarName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

export const ctrlEmailVerify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verification successful" });
};

export const ctrlResendVerifyEmail = async (req, res) => {
  const { error } = schemes.emailVerifyScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a targer="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click me to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};
