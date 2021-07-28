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
      console.log(error);
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
        .select("-password -createdAt -email -__v");
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

  async getUserProfile(id) {
    try {
      const user = await userModel
        .findById(id)
        .select("-password -__v -createdAt -_id");
      return user;
    } catch (error) {
      throw (new CustomError(404), "Not found user");
    }
  },

  async updatePassword(id, oldPassword, newPassword) {
    try {
      const user = await userModel.findById(id);
      console.log(user.toObject().password);
      if (comparePassword(oldPassword, user.toObject().password)) {
        user.password = hashPassword(newPassword);
        await user.save();
      } else {
        throw new CustomError(401, "Bad credentials");
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async updateProfile(id, values) {
    try {
      const user = await userModel.findById(id);
      Object.entries(values).forEach((item) => {
        user[item[0]] = item[1];
      });
      const userTemp = await user.save();
      return userTemp;
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
