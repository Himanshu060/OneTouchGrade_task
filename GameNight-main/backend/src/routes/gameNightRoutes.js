import express from "express";
import GameNight from "../models/GameNight.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Create a new game night (only 'host' can create)
router.post("/game_night", authorize("host"), async (req, res) => {
  try {
    const {
      name,
      title,
      location,
      date,
      time,
      gameDetails,
      playerCount,
      duration,
      complexity,
    } = req.body;
    if (
      !name ||
      !title ||
      !location ||
      !date ||
      !time ||
      !gameDetails ||
      !playerCount ||
      !duration ||
      !complexity
    )
      return res.status(400).json({ message: "All fields are required" });
    const gameNight = new GameNight({
      name,
      title,
      location,
      date,
      time,
      gameDetails,
      playerCount,
      duration,
      complexity,
      owner: req.user._id,
    });
    await gameNight.save();
    res.status(201).json(gameNight);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create game night", error: err.message });
  }
});

// Get all game nights (both 'host' and 'player' can read)
router.get("/game_night", authorize(), async (req, res) => {
  try {
    const gamenights = await GameNight.find();
    res.status(200).json(gamenights);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve game nights", error: err.message });
  }
});

// Get a single game night by ID (both 'host' and 'player' can read)
router.get("/game_night/:id", authorize(), async (req, res) => {
  try {
    const gamenight = await GameNight.findById(req.params.id);
    if (!gamenight)
      return res.status(404).json({ message: "Game night not found" });
    res.status(200).json(gamenight);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve game night", error: err.message });
  }
});

// Update a game night by ID (only 'host' can update)
router.put("/game_night/:id", authorize("host"), async (req, res) => {
  try {
    const {
      name,
      title,
      location,
      date,
      time,
      gameDetails,
      playerCount,
      duration,
      complexity,
    } = req.body;
    if (
      !name ||
      !title ||
      !location ||
      !date ||
      !time ||
      !gameDetails ||
      !playerCount ||
      !duration ||
      !complexity
    )
      return res.status(400).json({ message: "All fields are required" });
    const game = await GameNight.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Only update if the host owns the game night
      { name, title, location, date, time, gameDetails, playerCount, duration, complexity },
      { new: true }
    );
    if (!game)
      return res
        .status(404)
        .json({ message: "Game night not found or not authorized" });
    res.status(200).json(game);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update game night", error: err.message });
  }
});

// Delete a game night by ID (only 'host' can delete)
router.delete("/game_night/:id", authorize("host"), async (req, res) => {
  try {
    const game = await GameNight.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!game)
      return res
        .status(404)
        .json({ message: "Game night not found or not authorized" });
    res.status(200).json({ message: "Game night deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete game night", error: err.message });
  }
});

export default router;
