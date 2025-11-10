import express from "express";
import jwt from "jsonwebtoken";
import Category from "../models/categoryModel.js";

const router = express.Router();

//verifikasi token + role admin
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({mesage: "Token not found"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin"){
            return res.status(403).json({message: "Only admin can access"});
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token"});
    }
};

// Add Category
router.post("/", verifyAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Category.findOne({ name });
        if(existing) return res.status(400).json({message: "Category already exists"});
        
        const newCategory = await Category.create({ name });
        res.status(201).json({ message: "Category added successfully", category: newCategory});
    } catch (err) {
        res.status(500).json({ message: err.mesage});
    }
});

// Show Category
router.get("/", async (req, res ) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Category
router.put("/:id", verifyAdmin, async(req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id , req.body, {new: true});
        res.json({ message: "Category updated successfully", updated});
    } catch(err) {
        res.status(500).json({message: err.mesage});
    }
});

// Delete Category
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category successfully deleted"});
    } catch(err){
        res.status(500).json({message : err.message})
    }
});


export default router;