import express from "express";
import { userValidation } from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post(
  "/user/register",
  async (req, res, next) => {
    try {
      const validatedData = await userValidation.validate(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  async (req, res) => {
    const newUser = req.body;
    const user = await User.findOne({ email: newUser.email });

    if (user) {
      return res.status(400).send({ message: "User already exists." });
    }

    const plainPassword = newUser.password;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    newUser.password = hashedPassword;

    await User.create(newUser);

    return res.status(201).send({ message: "User registered successfully." });
  }
);

export default router;
