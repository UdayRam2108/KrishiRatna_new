import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import ImageSlider from "./ImageSlider";

function Home() {
  return (
    <>
      <Header />
      <ImageSlider />
      <h1 style={{ textAlign: "center", margin: "30px 0" }}>
        Welcome to KrishiRatna 🌾
      </h1>
      <Footer />
    </>
  );
}

export default Home;
