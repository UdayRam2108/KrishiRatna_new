import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Detail from "./Detail";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import MarketPrices from "./MarketPrices";

import Header from "./Header";
import Footer from "./Footer";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ GLOBAL HEADER */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/detail"
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          }
        />

        <Route path="/market-prices" element={<MarketPrices />} />
      </Routes>

      {/* ✅ GLOBAL FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
