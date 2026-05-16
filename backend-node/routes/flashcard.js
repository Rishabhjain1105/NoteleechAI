const express = require("express");
const router = express.Router();

const Flashcard = require("../models/Flashcard");
const { protect } = require("../middleware/auth");

// Save flashcard
router.post("/save", protect, async (req, res) => {
    try {
        const { topic, collectionName, flashcard } = req.body;

        const newFlashcard = new Flashcard({
            userId: req.user.id,
            topic,
            collectionName,
            flashcard
        });

        await newFlashcard.save();

        res.json({
            message: "Flashcard saved successfully",
            flashcard: newFlashcard
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get all flashcards for logged in user
router.get("/all", protect, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.json({ flashcards });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;