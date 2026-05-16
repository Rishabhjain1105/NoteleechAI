const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    collectionName: {
        type: String,
        required: true
    },
    flashcard: {
        topic: String,
        front: String,
        back: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);