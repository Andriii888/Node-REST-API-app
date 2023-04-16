import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser
  } from "../../controllers/auth-controllers.js";

export const authRouter = express.Router();
//замість ctrlWrapper написана validateBody в Лямзіна
authRouter.post("/register",ctrlWrapper(ctrlRegisterUser));