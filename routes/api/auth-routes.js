import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser
  } from "../../controllers/auth-controllers.js";

const router = express.Router();
router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);

export default {router};