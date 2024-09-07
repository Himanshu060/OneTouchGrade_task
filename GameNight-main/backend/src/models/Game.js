import {Schema, model} from "mongoose";

const gameSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    playerCount: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    complexity: {
        type: String,
        required: true,
    },
    gameDetails: {
        type: String,
        required: true,
    }
});

export default model("Game", gameSchema);