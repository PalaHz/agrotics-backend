import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user";
import { CustomError } from "../utils/custom-error";
export const userService = {
  login: async (email, password) => {
    try {
      let user = await userModel.findOne({ email: email });
      if (comparePassword(password, user.toObject().password)) {
        const tempUser = user.toObject();
        delete tempUser.password;
        const token = signToken(tempUser);
        return token;
      } else {
        throw new CustomError(400, "Bad Credentials");
      }
    } catch (error) {
      console.log(error)
      throw new CustomError(400, error);
    }
  },
  register: async (email, firstName, lastName, password) => {
    try {
      password = hashPassword(password);
      const user = new userModel({ email, firstName, lastName, password });
      const userConf = await user.save();
      return "User created succesfully";
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(400, "Email is already in use");
      }
      throw new CustomError(400, error);
    }
  },

  getAllUsers: async (user) => {
    try {
      const users = await userModel
        .find({ _id: { $ne: user._id }, rol: { $ne: "ADMIN" } })
        .select("-password");
      return users;
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },

  deleteUser: async (id) => {
    try {
      const user = await userModel.findByIdAndDelete(id);
      return user;
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },
};

const comparePassword = (password, DBPassword) => {
  return bcrypt.compareSync(password, DBPassword);
};

const signToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_KEY);
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
