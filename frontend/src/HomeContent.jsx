import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import "./App.css";

function HomeContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="home-content">
      {/* 🌾 ABOUT */}
      <div className="content-section fade-in">
        <h2>{t("about_title")}</h2>
        <p>{t("about_desc")}</p>
      </div>

      {/* ⚙️ HOW IT WORKS */}
      <div className="content-section light workflow">
        <h2 className="workflow-title">{t("how_it_works")}</h2>
        <p className="workflow-subtitle">{t("how_it_works_sub")}</p>

        <div className="workflow-steps">
          <div className="workflow-card step-1">
            <div className="icon">🔐</div>
            <h4>{t("wf_step1_title")}</h4>
            <p>{t("wf_step1_desc")}</p>
          </div>

          <div className="workflow-arrow">➡️</div>

          <div className="workflow-card step-2">
            <div className="icon">🌱</div>
            <h4>{t("wf_step2_title")}</h4>
            <p>{t("wf_step2_desc")}</p>
          </div>

          <div className="workflow-arrow">➡️</div>

          <div className="workflow-card step-3">
            <div className="icon">🌾</div>
            <h4>{t("wf_step3_title")}</h4>
            <p>{t("wf_step3_desc")}</p>
          </div>
        </div>
      </div>

      {/* 🌿 BENEFITS */}
      <div className="content-section fade-in">
        <h2>{t("benefits_title")}</h2>
        <ul className="benefits">
          <li>✅ {t("benefit1")}</li>
          <li>✅ {t("benefit2")}</li>
          <li>✅ {t("benefit3")}</li>
          <li>✅ {t("benefit4")}</li>
        </ul>
      </div>

      {/* 🚜 CTA */}
      <div className="content-section cta fade-in">
        <h2>{t("cta_title")}</h2>
        <p>{t("cta_desc")}</p>
        <button className="cta-button" onClick={() => navigate("/login")}>
          {t("cta_button")}
        </button>
      </div>
    </section>
  );
}

export default HomeContent;
