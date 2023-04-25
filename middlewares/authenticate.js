import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization =""} = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
      const { id } = jwt.verify(token, SECRET_KEY);
      console.log("tyt")
    const user = await User.findById(id);
    if (!user) {
      next(HttpError(401));
    }
    next();
  } catch (error) {
    next(HttpError(401));
  }
};
