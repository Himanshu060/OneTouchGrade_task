import { Schema, model } from "mongoose";

const gameNightSchema = new Schema({
  name: { type: String, required: true },                // Name of the game
  title: { type: String, required: true },               // Title of the game night or event
  location: { type: String, required: true },            // Location of the game event
  date: { type: Date, required: true },                  // Date of the game event
  time: { type: String, required: true },                // Time of the game event
  gameDetails: { type: String, required: true },         // Details about the game
  playerCount: { type: Number, required: true },         // Number of players required or involved
  duration: { type: Number, required: true },            // Duration of the game in minutes
  complexity: { type: String, required: true },          // Complexity level (e.g., 'easy', 'medium', 'hard')
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who added the game
  addedAt: { type: Date, default: Date.now },            // Timestamp of when the game was added
});

export default model("GameNight", gameNightSchema);

