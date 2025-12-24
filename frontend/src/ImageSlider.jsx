import { useEffect, useState } from "react";
import "./App.css";

const images = [
  "https://images.unsplash.com/photo-1560493676-04071c5f467b",
  "https://images.unsplash.com/photo-1598514982881-fc3d8d4c9d0c",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
];

function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="slider"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className="slider-overlay">
        <div className="slider-text">
          <h1>खेती अब बने Smart 🌾</h1>
          <p>Soil aur Mausam ke hisaab se sahi fasal ka chayan</p>
        </div>
      </div>
    </section>
  );
}

export default ImageSlider;
