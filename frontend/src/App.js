import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Detail from "./Detail";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import MarketPrices from "./MarketPrices";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
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

        {/* 🌾 NEW PAGE */}
        <Route path="/market-prices" element={<MarketPrices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
