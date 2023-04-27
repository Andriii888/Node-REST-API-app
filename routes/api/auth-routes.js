import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser,
    ctrlLoginUser,
    ctrlGetCurrent,
  } from "../../controllers/auth-controllers.js";
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();

router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);
router.post("/login",ctrlWrapper(ctrlLoginUser));
router.get("/current",authenticate,ctrlWrapper(ctrlGetCurrent))

export default router;