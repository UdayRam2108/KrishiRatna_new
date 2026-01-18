import { Link } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import logo from "./assets/logo.png";

function Header() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="main-header">
      <div className="header-bar">
        {/* 🌱 BRAND */}
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src={logo} 
            alt="KrishiRatna Logo" 
            style={{ 
              width: "80px",       
              height: "80px", 
              objectFit: "cover",
              borderRadius: "50%",
              border: "2px solid white"
            }} 
          />
          <h2 style={{ fontSize: "2.4rem" }}>KrishiRatna</h2>
        </div>

        {/* 📑 RIGHT SIDE (MENU + LANGUAGE) */}
        <div className="header-right">
          <nav className="menu-inline">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/">{t("back_home").replace("← ", "")}</Link>
            <Link to="/weather">🌦️ Weather</Link>
            <Link to="/login">{t("login")}</Link>
            <Link to="/register">{t("register")}</Link>
          </nav>

          <div className="lang-select">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
              <option value="gu">ગુજરાતી</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
