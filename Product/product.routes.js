import express from "express";
import { productAddValidation } from "./product.validation.js";
import Product from "./product.model.js";
import jwt from "jsonwebtoken";
import User from "../User/user.model.js";

const router = express.Router();

router.post(
  "/product/add",
  async (req, res, next) => {
    const authorization = req.headers.authorization;
    const splittedValues = authorization?.split(" ");
    const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

    if (!token) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    let payload;

    try {
      payload = jwt.verify(token, "r41d5t3w9v2j3");
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    next();
  },
  async (req, res, next) => {
    try {
      const validatedData = await productAddValidation.validate(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    const newProduct = req.body;
    await Product.create(newProduct);

    return res.status(201).send({ message: "Product added successfully." });
  }
);

export default router;
