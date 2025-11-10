import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import Product from "../models/productModel.js";

const router = express.Router();

// Middleware verifikasi admin
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

// Multer Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({storage});

//Add Product
router.post("/", verifyAdmin, upload.single("image"), async (req,res) => {
    try {
        const { name, description, price, stock, size, category } = req.body;
        const imagePath = req.file ? req.file.path: null;

        if (!name || !price || !category)
            return res.status(400).json({ message: "name, price, and category must be filled"});
        const newProduct = await Product.create({
            name, description, price, stock,size, category, image: imagePath, 
        });
        res.status(201).json({ message: "Product added seccessfully", product: newProduct});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Show Product
router.get("/", async (req, res) => {
    try {
        const product = await Product.find().populate("category", "name");
        res.json(product);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

//Get Product (id)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name");
        if(!product) return res.status(404).json({message: "Product not found"});
        res.json(product);
    } catch (err){
        res.status(500).json({ message: err.message})
    }
});

//Update Product
router.put("/:id", verifyAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, stock, size, category } = req.body;
        const imagePath = req.file ? req.file.path: undefined;
        
        const updatedData = {
            name, description, price, stock, size, category,
        };

        if (imagePath) updatedData.image = imagePath;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        );

        if (!updatedProduct)
            return res.status(404).json({ message: "Product not found "});

        res.json({ message: "Product successfully updated", updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

// Delete Product
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({message: "Product not found"});
        res.json({message: "Product deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default router;