import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser,
    ctrlLoginUser,
    ctrlGetCurrent,
    ctrlLogOut,
  } from "../../controllers/auth-controllers.js";
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();

router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);
router.post("/login",ctrlWrapper(ctrlLoginUser));
router.get("/current",authenticate,ctrlWrapper(ctrlGetCurrent));
router.post("/logout",authenticate,ctrlWrapper(ctrlLogOut));

export default router;