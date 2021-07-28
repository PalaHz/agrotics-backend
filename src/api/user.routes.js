import express from "express";
import { body, validationResult } from "express-validator";
import { adminMiddleware } from "../middlewares/adminRole";
import { authenticateJwt } from "../middlewares/authorization";
import { userService } from "../services/user";

/* Init */
const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await userService.register(
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.password
      );
      res.json({ message: "User Created Succesfully" });
    } catch (error) {
      res.status(error.status).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  body("email").notEmpty(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const token = await userService.login(req.body.email, req.body.password);
      res.json({ token: token });
    } catch (error) {
      res.status(error.status).json({ error: error.message });
    }
  }
);

router.get("/", authenticateJwt, async (req, res) => {
  try {
    const users = await userService.getAllUsers(res.locals.user);
    res.json(users);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

router.delete("/", authenticateJwt, adminMiddleware, async (req, res) => {
  try {
    const user = await userService.deleteUser(req.query.id);
    res.json({ message: "User Deleted Succesfully" });
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

router.get("/profile", authenticateJwt, async (req, res) => {
  try {
    const user = await userService.getUserProfile(res.locals.user._id);
    res.send(user);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

router.post(
  "/update-profile",
  authenticateJwt,
  body("email").optional(),
  body("firstName").optional(),
  body("lastName").optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await userService.updateProfile(
        res.locals.user._id,
        req.body
      );
      res.json(user);
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  }
);

router.post(
  "/update-password",
  body("oldPassword").notEmpty().isString(),
  body("newPassword").notEmpty().isString(),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const response = await userService.updatePassword(
        res.locals.user._id,
        req.body.oldPassword,
        req.body.newPassword
      );
      res.json({ message: "Password updated succesfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;
