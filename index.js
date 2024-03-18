import express from "express";
import connectDB from "./db.connect.js";
import userRoutes from "./User/user.routes.js";
import productRoutes from "./Product/product.routes.js";

const app = express();

app.use(express.json());

connectDB();

app.use(userRoutes);
app.use(productRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
