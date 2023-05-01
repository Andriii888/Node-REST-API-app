import express from 'express';
import { ctrlWrapper } from "../../utils/ctrlWrapper.js";
import {
    ctrlRegisterUser,
    ctrlLoginUser,
    ctrlGetCurrent,
    ctrlLogOut,
    ctrlSubscription,
    ctrlUpdateAvatar,
  } from "../../controllers/auth-controllers.js";
import {authenticate} from '../../middlewares/authenticate.js';
import {upload} from '../../middlewares/upload.js';


const router = express.Router();

router.post("/register",
ctrlWrapper(ctrlRegisterUser)
);
router.post("/login",ctrlWrapper(ctrlLoginUser));
router.get("/current",authenticate,ctrlWrapper(ctrlGetCurrent));
router.post("/logout",authenticate,ctrlWrapper(ctrlLogOut));
router.patch("/",authenticate,ctrlWrapper(ctrlSubscription));
router.patch("/avatars",authenticate,upload.single("avatar"),ctrlWrapper(ctrlUpdateAvatar));

export default router;