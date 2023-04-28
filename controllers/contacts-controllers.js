import { HttpError } from "../helpers/HttpError.js";
import { Contact, schems } from "../models/contact.js";

export const ctrlGetAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (favorite) {
    return res.json(await Contact.find({ owner,favorite:true}, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "name email")  
    )
  }
  res.json(await Contact.find({ owner}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email")  
  );
};
export const ctrlGetContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found:()`);
  }
  res.json(result);
};
export const ctrlAddContact = async (req, res) => {
  const { error } = schems.addScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { _id: owner } = req.user;
  res.status(201).json(await Contact.create({ ...req.body, owner }));
};

export const ctrlChangeContactById = async (req, res) => {
  const { error } = schems.addScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found:()`);
  }
  res.json(result);
};

export const ctrlDeleteContacById = async (req, res) => {
  const { contactId, name } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found:()`);
  }
  res.json({ message: "Contact deleted successed" });
};

export const ctrlUpdateFavoriteLine = async (req, res) => {
  const { error } = schems.updateFavoriteLineScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found:()`);
  }
  res.json(result);
};
