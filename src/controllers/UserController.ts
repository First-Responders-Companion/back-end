import ROLES from "../utils/Roles";
import User from "../models/User";
import * as Token from "../utils/Token";

class UserController {
  async register(
    username: string,
    password: string,
    role = ROLES.CITIZEN,
    name?: string,
    sex?: string,
    dob?: number
  ) {
    let user = await User.findOne({ username }).exec();

    if (user) {
      throw new Error(`User "${username}" already exists`);
    } else {
      user = await new User({
        username,
        password,
        role,
        name,
        sex,
        dob,
      }).save();
    }

    return user;
  }

  async login(username: string, password: string) {
    const user = await User.findOne({ username })
      // @see https://stackoverflow.com/a/12096922
      .select("+password")
      .exec();

    if (user) {
      const isMatch = await user.comparePassword(password);
      const { password: _, ...fieldsToReturn } = user.toObject();
      if (isMatch) {
        return {
          token: Token.generate(user.id, user.role),
          ...fieldsToReturn,
        };
      }
    }

    throw new Error(`User "${username}" does not exist or incorrect password`);
  }
}

export default new UserController();
