import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    products: [ {
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, },
        quantity: { type: Number, required: true, min: 1,},
    },],
    totalPrice: {type: Number, required: true, },
    address: { type: String, required:true },
    paymentMethod: { type: String, enum: ['COD', 'Transfer Bank', 'E-Wallet', 'Credit Card'], required: true, },
    status: { type: String, enum: ["Pending", "Processing", "Completed", "Cancelled"], default: "Pending", },
} , {timestamps: true, }
);

export default mongoose.model("Order", orderSchema);