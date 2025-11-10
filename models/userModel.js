import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    username: { type: String, required: true, unique: true},
    password: { type : String, required: true },
    email: { type: String, required: true, unique: true},
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer"}
});

export default mongoose.model("User", userSchema);