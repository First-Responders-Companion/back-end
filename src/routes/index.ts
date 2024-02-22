import { Router } from "express";
import login from "./login";
import user from "./user";
import missingComplaint from "./missingComplaint";
import authenticate from "../middleware/authenticate";

export default Router()
  .use("/login", login)
  .use("/users", user)
  .use("/missingComplaints", authenticate, missingComplaint);
