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

router.get("/:contactId", ctrlWrapper(ctrlGetContactById));

router.post("/", ctrlWrapper(ctrlAddContact));

router.delete("/:contactId", ctrlWrapper(ctrlDeleteContacById));

router.put("/:contactId", ctrlWrapper(ctrlChangeContactById));

router.patch("/:contactId/favorite",ctrlWrapper(ctrlUpdateFavoriteLine));

export default router;
