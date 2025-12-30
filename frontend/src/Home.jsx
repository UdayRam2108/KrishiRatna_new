import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import ImageSlider from "./ImageSlider";
import HomeContent from "./HomeContent";
import MarketTicker from "./MarketTicker";

function Home() {
  return (
    <>
      <Header />
      <ImageSlider />
      <MarketTicker /> 
      <HomeContent />
      <Footer />
    </>
  );
}

export default Home;
