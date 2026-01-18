import MyListings from "./MyListings";
import EditListing from "./EditListing";
import Fertilizer from "./Fertilizer";

import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Detail from "./Detail";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import MarketPrices from "./MarketPrices";
import WeatherPage from "./WeatherPage";
import MarketHome from "./MarketHome";
import AddListing from "./AddListing";
import ListingDetail from "./ListingDetail";

import Header from "./Header";
import Footer from "./Footer";

import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fertilizer" element={<Fertilizer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/marketplace/edit/:id" element={<EditListing />} />



        <Route
          path="/detail"
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          }
        />

        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/weather" element={<WeatherPage />} />

        {/* 🛒 FARMER MARKET */}
        <Route path="/marketplace" element={<MarketHome />} />
        <Route path="/marketplace/add" element={<AddListing />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
