import { Link } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";

function Header() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="main-header">
      <div className="header-bar">
        {/* 🌱 BRAND */}
        <div className="brand">
          <h2>🌱KrishiRatna</h2>
        </div>

        {/* 📑 RIGHT SIDE (MENU + LANGUAGE) */}
        <div className="header-right">
          <nav className="menu-inline">
            <Link to="/">{t("back_home").replace("← ", "")}</Link>
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
