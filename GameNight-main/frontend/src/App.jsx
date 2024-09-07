import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [gameNights, setGameNights] = useState([]);
  const [selectedGameNight, setSelectedGameNight] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/me", {
          withCredentials: true,
        });
        if (response.data) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(false);
        }
      } catch (error) {
        setUserInfo(false);
      }
    };

    checkAuth();
  }, []);

  const createGameNight = async (gameNightData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/game_night",
        gameNightData,
        {
          withCredentials: true,
        }
      );
      console.log("Game night created:", response.data);
      fetchGameNights(); // Refresh game nights list
    } catch (error) {
      console.error("Failed to create game night:", error);
    }
  };

  const updateGameNight = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/game_night/${id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );
      console.log("Game night updated:", response.data);
      fetchGameNights(); // Refresh game nights list
    } catch (error) {
      console.error("Failed to update game night:", error);
    }
  };

  const deleteGameNight = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/game_night/${id}`, {
        withCredentials: true,
      });
      console.log(`Game night with id ${id} deleted`);
      fetchGameNights(); // Refresh game nights list
    } catch (error) {
      console.error("Failed to delete game night:", error);
    }
  };

  const fetchGameNights = async () => {
    try {
      const response = await axios.get("http://localhost:8000/game_night", {
        withCredentials: true,
      });
      setGameNights(response.data);
    } catch (error) {
      console.error("Failed to fetch game nights:", error);
    }
  };

  const joinGameNight = async (id) => {
    try {
      // Implement join game night logic here
      console.log(`Joined game night with id: ${id}`);
    } catch (error) {
      console.error("Failed to join game night:", error);
    }
  };

  const inviteUserByEmail = async (gameNightId) => {
    try {
      const email = prompt("Enter the email address to invite:");
      if (!email) return;

      const response = await axios.post(
        `http://localhost:8000/game_night/${gameNightId}/invite`,
        { email },
        {
          withCredentials: true,
        }
      );
      console.log(`Invitation sent to ${email}:`, response.data);
      alert(`Invitation sent to ${email}`);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("Failed to send invitation. Please try again.");
    }
  };

  const toggleDetails = (id) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderGameNightActions = () => {
    return (
      <>
        {userInfo.role === "host" && (
          <div>
            <button onClick={() => createGameNight(promptGameNightDetails())}>
              Create New Game Night
            </button>
            <h3>Manage Your Game Nights</h3>
            <div className="game-night-container">
              {gameNights.map((night) => (
                <div key={night._id} className="game-night-card">
                  <h4>{night.title}</h4>
                  <div className="card-buttons">
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedGameNight(night)}
                    >
                      Manage
                    </button>
                    <button onClick={() => inviteUserByEmail(night._id)}>
                      Invite Friends
                    </button>
                    <button onClick={() => toggleDetails(night._id)}>
                      {showDetails[night._id] ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                  {showDetails[night._id] && (
                    <div className="game-night-details">
                      <p>
                        <strong>Location:</strong> {night.location}
                      </p>
                      <p>
                        <strong>Date:</strong> {night.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {night.time}
                      </p>
                      <p>
                        <strong>Player Count:</strong> {night.playerCount}
                      </p>
                      <p>
                        <strong>Duration:</strong> {night.duration} hours
                      </p>
                      <p>
                        <strong>Complexity:</strong> {night.complexity}
                      </p>
                      <p>
                        <strong>Game Details:</strong> {night.gameDetails}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {userInfo.role === "player" && (
          <div>
            <h3>Available Game Nights</h3>
            <div className="game-night-container">
              {gameNights.map((night) => (
                <div key={night._id} className="game-night-card">
                  <h4>{night.title}</h4>
                  <button onClick={() => joinGameNight(night._id)}>Join</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const promptGameNightDetails = () => {
    const name = prompt("Enter Game Night Name:");
    const title = prompt("Enter Game Title:");
    const location = prompt("Enter Location:");
    const date = prompt("Enter Date (YYYY-MM-DD):");
    const time = prompt("Enter Time (HH:MM):");
    const gameDetails = prompt("Enter Game Details:");
    const playerCount = prompt("Enter Player Count:");
    const duration = prompt("Enter Duration (minutes):");
    const complexity = prompt("Enter Complexity (Easy/Medium/Hard):");

    return {
      name,
      title,
      location,
      date,
      time,
      gameDetails,
      playerCount,
      duration,
      complexity,
    };
  };

  useEffect(() => {
    if (userInfo) {
      fetchGameNights();
    }
  }, [userInfo]);

  if (userInfo === null) {
    return <p>Loading...</p>;
  }

  if (!userInfo) {
    return <p>You need to log in</p>;
  }

  return (
    <div>
      <h1>Welcome, {userInfo.role}</h1>
      {renderGameNightActions()}
      {selectedGameNight && (
        <div>
          <h2>Manage Game Night: {selectedGameNight.title}</h2>
          <button
            onClick={() =>
              updateGameNight(selectedGameNight._id, promptGameNightDetails())
            }
          >
            Update Game
          </button>
          <button onClick={() => deleteGameNight(selectedGameNight._id)}>
            Delete Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
