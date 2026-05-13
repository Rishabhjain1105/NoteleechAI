const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pdfs: [
        {
            fileName: { type: String },
            collectionName: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }
    ],
    chatHistory: [
        {
            collectionName: { type: String },
            question: { type: String },
            answer: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);