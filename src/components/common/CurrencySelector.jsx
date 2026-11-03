import { useState, useEffect } from "react";
import {
  SUPPORTED_CONVERTER_CURRENCIES,
  getSelectedCurrency,
  setSelectedCurrency
} from "../../utils/pricing.js";

export default function CurrencySelector({ compact = false }) {
  const [current, setCurrent] = useState(function() {
    return getSelectedCurrency();
  });

  useEffect(function() {
    function handleUpdate() {
      setCurrent(getSelectedCurrency());
    }
    window.addEventListener("hire_currency_changed", handleUpdate);
    return function() {
      window.removeEventListener("hire_currency_changed", handleUpdate);
    };
  }, []);

  function handleChange(e) {
    const code = e.target.value;
    const found = SUPPORTED_CONVERTER_CURRENCIES.find(function(c) { return c.code === code; });
    if (found) {
      setSelectedCurrency(found);
      setCurrent(found);
    }
  }

  return (
    <div className={`d-inline-flex align-items-center ${compact ? "gap-1" : "gap-2"}`}>
      {!compact && (
        <span className="small text-muted fw-semibold d-none d-md-inline">
          💱 Currency:
        </span>
      )}
      <select
        className={`form-select form-select-sm bg-white border shadow-sm ${compact ? "py-1 px-2" : "py-1 px-2"}`}
        style={{ fontSize: compact ? "0.78rem" : "0.85rem", width: compact ? "110px" : "150px" }}
        value={current.code}
        onChange={handleChange}
        title="Choose target converted currency"
      >
        {SUPPORTED_CONVERTER_CURRENCIES.map(function(c) {
          return (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          );
        })}
      </select>
    </div>
  );
}
