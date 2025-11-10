import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId : { type: String, unique: true },
    name : { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    price: { type: Number, required: true},
    stock: { type: Number, required: true, default: 0},
    size: { type: String, required: false},
    description: { type: String },
    image: {type: String},
    createdAt: { type: Date, default: Date.now }, 
});

export default mongoose.model("Product", productSchema);