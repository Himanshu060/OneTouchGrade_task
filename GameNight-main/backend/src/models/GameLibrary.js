import { Schema, model } from "mongoose";

const gameLibrarySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    games : [{
        type: Schema.Types.ObjectId,
        ref: "Game",
        status : {
            type: String,
            enum: ['added','owned', 'wishlist'],
            default: 'added',
        },
    }],
});

export default model("GameLibrary", gameLibrarySchema);