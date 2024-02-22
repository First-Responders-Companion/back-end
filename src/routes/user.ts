import { Router } from "express";
import authenticate, {
  IAuthenticatedRequest,
} from "../middleware/authenticate";

import UserController from "../controllers/UserController";
import ROLES from "../utils/Roles";

export default Router()
  /**
   * Register
   */
  .post("/", async (request, response) => {
    const {
      username,
      password,
      role = ROLES.CITIZEN,
      name,
      sex,
      dob,
    } = request.body;

    try {
      const user = (
        await UserController.register(username, password, role, name, sex, dob)
      ).toObject();

      // hide password and __v manually
      delete user.password;
      delete user.__v;

      response.send(user);
    } catch (error: any) {
      response.status(401).send({ error: error.message });
    }
  })

  /**
   * List all users without role restriction
   */
  .get("/all", authenticate, async (_req: IAuthenticatedRequest, response) => {
    const users = await UserController.listUsers();
    try {
      response.status(200).send(users);
    } catch ({ message }) {
      response.status(404).send({ message });
    }
  });
