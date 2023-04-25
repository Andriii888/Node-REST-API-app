import express from "express";

import { ctrlWrapper } from "../../utils/ctrlWrapper.js";

import {
  ctrlGetAllContacts,
  ctrlGetContactById,
  ctrlAddContact,
  ctrlDeleteContacById,
  ctrlUpdateFavoriteLine,
  ctrlChangeContactById,
} from "../../controllers/contacts-controllers.js";

import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();
router.get("/",authenticate, ctrlWrapper(ctrlGetAllContacts));

router.get("/:contactId",authenticate,ctrlWrapper(ctrlGetContactById));

router.post("/",authenticate,ctrlWrapper(ctrlAddContact));

router.delete("/:contactId",authenticate,ctrlWrapper(ctrlDeleteContacById));

router.put("/:contactId",authenticate,ctrlWrapper(ctrlChangeContactById));

router.patch("/:contactId/favorite",authenticate,ctrlWrapper(ctrlUpdateFavoriteLine));

export default router;
