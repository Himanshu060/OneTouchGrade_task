import express from "express";
import GameLibrary from "../models/GameLibrary.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Add a game to the library
router.post("/game_library/", authorize(), async (req, res) => {
    try {
        const { gameId } = req.body;
        const gameLibrary = await GameLibrary.findOneAndUpdate(
            { userId: req.user._id },
            { $addToSet: { games: { _id: gameId} } },
            { new: true, upsert: true }
        );
        res.status(200).json(gameLibrary);
    } catch (err) {
        res.status(500).json({ message: "Failed to add game to library", error: err.message });
    }
});

export default router;