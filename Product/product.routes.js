import express from "express";
import { productAddValidation } from "./product.validation.js";
import Product from "./product.model.js";
import jwt from "jsonwebtoken";
import User from "../User/user.model.js";
import mongoose from "mongoose";

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

router.get(
  "/product/details/:id",
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
  (req, res, next) => {
    const isValidMongoId = mongoose.isValidObjectId(req.params.id);

    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    next();
  },
  async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    return res.status(200).send({ message: "success", productDetails: product });
  }
);

router.delete(
  "/product/delete/:id",
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
  (req, res, next) => {
    const isValidMongoId = mongoose.isValidObjectId(req.params.id);

    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    next();
  },
  async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    await Product.deleteOne({ _id: productId });

    return res.status(200).send({ message: "Product deleted successfully." });
  }
);

export default router;
