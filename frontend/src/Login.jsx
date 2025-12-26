import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useLanguage } from "./context/LanguageContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { username, password }
      );

      localStorage.setItem("token", res.data.access);
      navigate("/detail");
    } catch {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{t("welcome_farmer")}</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>{t("login")}</button>

        <p
          style={{ cursor: "pointer", color: "green" }}
          onClick={() => navigate("/register")}
        >
          {t("new_user")}
        </p>

        <button className="back-button" onClick={() => navigate("/")}>
          {t("back_home")}
        </button>
      </div>
    </div>
  );
}

export default Login;
