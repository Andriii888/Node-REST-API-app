import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser,
    ctrlLoginUser
  } from "../../controllers/auth-controllers.js";

const router = express.Router();

router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);
router.post("/login",ctrlWrapper(ctrlLoginUser))

export default router;