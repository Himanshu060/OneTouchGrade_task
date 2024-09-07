import Game from '../models/Game.js';
import express from 'express';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

// Create a new game
router.post('/game', authorize(), async (req, res) => {
    try {
        const { title, playerCount, duration, complexity, gameDetails } = req.body;
        if (!title || !playerCount || !duration || !complexity || !gameDetails)
            return res.status(400).json({ message: 'All fields are required' });
        const game = new Game({
            title,
            playerCount,
            duration,
            complexity,
            gameDetails,
        });
        await game.save();
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create game', error: err.message });
    }
});

// Get all games
router.get('/game', authorize(), async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch games', error: err.message });
    }
});

// Get a game by id
router.get('/game/:id', authorize(), async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch game', error: err.message });
    }
});

// Update a game by id
router.put('/game/:id', authorize(), async (req, res) => {
    try {
        const { title, playerCount, duration, complexity, gameDetails } = req.body;
        const game = await Game.findByIdAndUpdate(req
            .params.id, 
            { title, playerCount, duration, complexity, gameDetails }
            , { new: true });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update game', error: err.message });
    }
} );

// Delete a game by id
router.delete('/game/:id', authorize(), async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete game', error: err.message });
    }
});

export default router;