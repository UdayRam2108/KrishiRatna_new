import "./App.css";
import { useLanguage } from "./context/LanguageContext";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 🌾 BRAND */}
        <div className="footer-col">
          <h3 className="footer-brand">🌱 KrishiRatna</h3>
          <p className="footer-text">
            {t("Desc")}
          </p>
           <span>📸</span>
            <span>💼</span>
            <span>▶️</span>
            <span>📘</span>
        </div>

        {/* 📞 CONTACT */}
        <div className="footer-col">
          <h4>{t("Contact_us")}</h4>
          <p>📞 +91 9313331841</p>
          <p>✉️ support@krishiratna.in</p>
          <p>📍 India</p>
        </div>

        {/* 🔗 LINKS */}
        <div className="footer-col">
          <h4>{t("Quick_links")}</h4>
          <Link to="/login">{t("login")}</Link>
          <Link to="/register">{t("register")}</Link>
        </div>

        {/* 📰 INFO */}
        <div className="footer-col">
          <h4>{t("Updates")}</h4>
          <div className="footer-box">
             <Link to="/login">{t("NEWS")}</Link>
          <Link to="/register">{t("Articals")}</Link>
            {t("footer_updates_text")}
          </div>
        </div>

        {/* 🌐 SOCIAL MEDIA */}
        <div className="footer-col">
          <h4>{t("Follow_us")}</h4>

          <div className="footer-social-icons">
            <a
              href="https://instagram.com/uday_ram_08"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              {/* Instagram */}
              <svg viewBox="0 0 24 24">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1 1 0 10.001 2.001A1 1 0 0018.5 6.5z" />
              </svg>
            </a>

            <a
              href="https://facebook.com/YOUR_FACEBOOK"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              {/* Facebook */}
              <svg viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2V9.5A3.5 3.5 0 0114 6h3v3h-3a1 1 0 00-1 1V12h4l-1 3h-3v7A10 10 0 0022 12z"/>
              </svg>
            </a>

            <a
              href="https://twitter.com/YOUR_TWITTER"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              {/* Twitter / X */}
              <svg viewBox="0 0 24 24">
                <path d="M18.2 2H21l-6.4 7.3L22 22h-6.2l-4.9-6.4L5.3 22H2.5l6.9-7.9L2 2h6.3l4.4 5.9L18.2 2z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 KrishiRatna 🌾 | Smart Farming for India
      </div>
    </footer>
  );
}

export default Footer;
