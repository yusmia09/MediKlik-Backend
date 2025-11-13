import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import categoryRouter from "./routes/categoryRouter.js";
import productRouter from "./routes/productRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/orders",orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cart/checkout", cartRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
