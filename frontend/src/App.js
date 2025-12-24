import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Detail from "./Detail";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
