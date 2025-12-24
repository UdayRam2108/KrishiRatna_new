import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/register/",
        { username, password }
      );
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Join KrishiRatna 🌾</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>Register</button>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Register;
