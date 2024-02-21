import { Router } from "express";
import login from "./login";
import user from "./user";

export default Router().use("/login", login).use("/users", user);
