import express from "express";
import { userLoginValidation, userRegisterValidation } from "./user.validation.js";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post(
  "/user/register",
  async (req, res, next) => {
    try {
      const validatedData = await userRegisterValidation.validate(req.body);
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

router.post(
  "/user/login",
  async (req, res, next) => {
    try {
      const validatedData = await userLoginValidation.validate(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

    const loginCredentials = req.body;
    const user = await User.findOne({ email: loginCredentials.email });

    if (!user) {
      return res.status(404).send({ message: "Invalid email or password." });
    }

    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;

    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (!passwordMatch) {
      return res.status(404).send({ message: "Invalid email or password." });
    }

    user.password = undefined;

    //token = jwt.sign({payload}, "secret", {expiresIn: "7d"})

    const token = jwt.sign({ email: user.email }, "r41d5t3w9v2j3", { expiresIn: "7d" });

    return res.status(200).send({ message: "User logged in successfully.", userDetails: user, token: token });
  },
  () => {}
);

export default router;
