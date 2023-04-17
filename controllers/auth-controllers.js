import { HttpError } from "../helpers/HttpError.js";
import { User, schemes } from "../models/user.js";

export const ctrlRegisterUser= async (req,res)=>{
    const { error } = schemes.registerScheme.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
const result = await User.create(req.body);
res.status(201).json({name:result.name,email:result.email})
};

