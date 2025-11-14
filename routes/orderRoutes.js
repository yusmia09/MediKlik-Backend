import express from "express";
import jwt, { decode } from "jsonwebtoken";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js"

const router = express.Router();

//Middleware verifikasi user
const verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token not found"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({ message: "Invalid Token "});
    }
};

// Middlewere Admin
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({message: "Token not found"});
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin"){
            return res.status(403).json({message: "Only admin can access"});
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({message: "Invalid Token"});
    }
};

//Create Order (user)
router.post("/", verifyUser, async (req, res) => {
  try {
    const { products, address, paymentMethod } = req.body;

    let totalPrice = 0;

    for (const item of products) {
      const productData = await Product.findById(item.product);
      if (!productData)
        return res.status(404).json({ message: "Product not found" });

      if (productData.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${productData.name}` });
      }

      // kurangi stok produk
      productData.stock -= item.quantity;
      await productData.save();

      totalPrice += productData.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      products,
      totalPrice,
      address,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all orders (Admin)
router.get("/", verifyAdmin, async(req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "username email")
        .populate("products.product","name price");
        res.json(orders);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

//Update order status (Admin)
router.put("/:id/status", verifyAdmin, async(req, res) => {
    try {
        const {status} = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            {new: true}
        );
        if (!updatedOrder) 
            return res.status(404).json({message: "Order not found"});
        res.json({message: "Status updated", updatedOrder});
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

router.get("/my", verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 export default router;