import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "./context/LanguageContext";
import "./App.css";

function MarketPrices() {
  const { t } = useLanguage();

  const [prices, setPrices] = useState([]);
  const [states, setStates] = useState([]);
  const [state, setState] = useState("");

  // Load states once
  useEffect(() => {
    fetchStates();
  }, []);

  // Load prices when state changes
  useEffect(() => {
    if (state) {
      fetchPrices();
    }
  }, [state]);

  const fetchStates = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/mandi/states/");
      const list = res.data.states || [];
      setStates(list);

      // Auto select first state
      if (list.length > 0) {
        setState(list[0]);
      }
    } catch (err) {
      console.error("Failed to load states", err);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/mandi/prices/?state=${state}&limit=100`
      );
      setPrices(res.data.prices || []);
    } catch (err) {
      console.error("Failed to load prices", err);
    }
  };

  return (
    <div className="market-page">
      <h2>🌾 {t("rates")} – Market Prices</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <label>State: </label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table className="market-table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Market</th>
            <th>Price (₹)</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p, i) => (
            <tr key={i}>
              <td>{t(`crop_${p.crop_key}`)}</td>
              <td>{p.market}</td>
              <td>₹{p.price}</td>
              <td>
                {p.trend === "up" && "▲"}
                {p.trend === "down" && "▼"}
                {p.trend === "same" && "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {prices.length === 0 && <p>❌ No data for this state</p>}
    </div>
  );
}

export default MarketPrices;
