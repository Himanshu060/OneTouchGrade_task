import express from "express";
import "./db/connection.js";
import authRouter from "./routes/auth.js";
import gameNightRouter from "./routes/gameNightRoutes.js";
import gameRouter from "./routes/gameRoutes.js";
import gameLibraryRouter from "./routes/gameLibraryRoutes.js";
import inviteRouter from "./routes/inviteRouter.js";
import dotenv from "dotenv"; 
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();


//express use body
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));

// Define a port to listen on
const port = process.env.PORT;

// Use the router
app.use(authRouter);
app.use(gameNightRouter);
app.use(gameRouter);
app.use(gameLibraryRouter);
app.use(inviteRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
