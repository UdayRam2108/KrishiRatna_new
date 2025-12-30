import { useEffect, useState } from "react";
import "./App.css";
import { useLanguage } from "./context/LanguageContext";

/* IMPORT YOUR IMAGES (same as before) */
import slide1 from "./assets/slider/slide1.jpg";
import slide2 from "./assets/slider/slide2.jpg";
import slide3 from "./assets/slider/slide3.jpg";
import slide4 from "./assets/slider/slide4.jpg";
import slide5 from "./assets/slider/slide5.jpg";

const images = [slide1, slide2, slide3, slide4, slide5];

function ImageSlider() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="slider">
      {/* IMAGE LAYERS */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className={`slider-img ${i === index ? "active" : ""}`}
        />
      ))}

      {/* TEXT OVERLAY */}
      <div className="slider-overlay">
        <div className="slider-text">
          <h1>{t("home_title")}</h1>
          <p>{t("home_subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

export default ImageSlider;