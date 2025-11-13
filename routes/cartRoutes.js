import express from "express";
import jwt from "jsonwebtoken";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js"

const router = express.Router();

// Minddleware user
const verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token not found"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({ message: "Invalid Token "});
    }
};

// Add to cart
router.post("/", verifyUser, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id});

        if(!cart) {
            cart = new Cart({user: req.user.id, products: []});
        }

        // const quantity = Number(quantity);
        const index = cart.products.findIndex(
            (p) => p.product.toString() === productId );
        if (index >=0 ){
            cart.products[index].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity});
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Get Cart User
router.get("/", verifyUser, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id}).populate("products.product", "name price stock");
        res.json(cart || { products : [] });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Delete
router.delete("/:productId", verifyUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Checkout User
router.post("/checkout", verifyUser, async (req, res)=> {
    try {
        const cart = await Cart.findOne({user: req.user.id}).populate(
            "products.product",
            "name price stock"
        );

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({message: "Cart is empty"});
        }

        let totalPrice = 0;

        for(const item of cart.products){
            const productData = await Product.findById(item.product);
            if (!productData)
                return res.status(404).json({message: "Product not found"});
            if (productData.stock < item.quantity){
                return res.status(400).json({message : ` Not enough stock for ${productData.name} ` });
            }

            //Kurangi stok
            productData.stock -= item.quantity;
            await productData.save();

            totalPrice += productData.price * item.quantity;
        }

        const order = await Order.create({
        user: req.user.id,
        products: cart.products.map((p) => ({
            product: p.product._id,
            quantity: p.quantity,
        })),
        totalPrice,
        address: req.body.address || "Belum diisi",
        paymentMethod: req.body.paymentMethod || "COD",
        });

        // Kosongkan cart setelah checkout
        cart.products = [];
        await cart.save();

        res.status(201).json({ message: "Checkout berhasil", order });

    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default router;