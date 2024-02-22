import { NextFunction, Response } from "express";
import ROLES from "../utils/Roles";
import { IAuthenticatedRequest } from "./authenticate";

const limitToRoles = (roles: ROLES[]) => {
  return async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user && !roles.includes(req.user.role as ROLES)) {
      return res.status(403).send("Access denied.");
    }
    return next();
  };
};

export default limitToRoles;
