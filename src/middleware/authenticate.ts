import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/User";
import * as Token from "../utils/Token";

export interface IAuthenticatedRequest extends Request {
  user?: IUser;
}

const authenticate = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    return res.status(401).send("Missing authorization header.");
  }
  const token = authHeader.split(" ")[1];
  const decoded = Token.validate(token);

  if (!decoded) {
    return res.status(401).send("Unauthorized.");
  }

  const user = await userModel.findById(decoded.uid);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  req.user = user;

  return next();
};

export default authenticate;
