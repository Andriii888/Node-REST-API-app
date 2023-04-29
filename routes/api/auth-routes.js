import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser,
    ctrlLoginUser,
    ctrlGetCurrent,
    ctrlLogOut,
    ctrlSubscription,
  } from "../../controllers/auth-controllers.js";
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();

router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);
router.post("/login",ctrlWrapper(ctrlLoginUser));
router.get("/current",authenticate,ctrlWrapper(ctrlGetCurrent));
router.post("/logout",authenticate,ctrlWrapper(ctrlLogOut));
router.patch("/:subscription",authenticate,ctrlWrapper(ctrlSubscription))

export default router;