import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getShared, getSession, setSession, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";

export default function Compare() {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState(function() {
    return getShared("hire_properties", initialProperties).filter(function(p) {
      return p.status !== "pending_admission";
    });
  });

  const [compareList, setCompareList] = useState(function() {
    const props = getShared("hire_properties", initialProperties).filter(function(p) {
      return p.status !== "pending_admission";
    });
    const stored = getSession("hire_compare", []);
    return stored.map(function(i) {
      return props.find(function(p) { return String(p.id) === String(i.id); }) || i;
    });
  });

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const props = getShared("hire_properties", initialProperties).filter(function(p) {
        return p.status !== "pending_admission";
      });
      setAllProperties(props);
      const stored = getSession("hire_compare", []);
      setCompareList(stored.map(function(i) {
        return props.find(function(p) { return String(p.id) === String(i.id); }) || i;
      }));
    });

    return unsubscribe;
  }, []);

  function saveCompare(updated) {
    setCompareList(updated);
    setSession("hire_compare", updated);
    window.dispatchEvent(new Event("hire_compare_updated"));
  }

  function handleSelect(slotIndex, propertyId) {
    if (!propertyId) {
      const next = [...compareList];
      next.splice(slotIndex, 1);
      saveCompare(next);
      return;
    }
    const found = allProperties.find(function(p) { return String(p.id) === String(propertyId); });
    if (!found) return;

    const next = [...compareList];
    next[slotIndex] = found;
    saveCompare(next);
  }

  function handleClear() {
    saveCompare([]);
  }

  const item1 = compareList[0] || null;
  const item2 = compareList[1] || null;

  return (
    <div style={{ maxWidth: "880px", margin: "24px auto", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", color: "#111" }}>Hotel Comparison Tool</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Select any two properties to compare key parameters side by side.</p>
        </div>
        {(item1 || item2) && (
          <button
            type="button"
            onClick={handleClear}
            style={{ padding: "6px 12px", fontSize: "0.85rem", cursor: "pointer", background: "#f5f5f5", border: "1px solid #aaa", borderRadius: "3px" }}
          >
            Reset
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", background: "#fafafa", border: "1px solid #ccc", padding: "12px", borderRadius: "4px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "6px" }}>Select First Hotel:</label>
          <select
            value={item1 ? item1.id : ""}
            onChange={function(e) { handleSelect(0, e.target.value); }}
            style={{ width: "100%", padding: "6px", fontSize: "0.85rem", border: "1px solid #999", borderRadius: "3px" }}
          >
            <option value="">-- Choose Hotel 1 --</option>
            {allProperties.map(function(p) {
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "6px" }}>Select Second Hotel:</label>
          <select
            value={item2 ? item2.id : ""}
            onChange={function(e) { handleSelect(1, e.target.value); }}
            style={{ width: "100%", padding: "6px", fontSize: "0.85rem", border: "1px solid #999", borderRadius: "3px" }}
          >
            <option value="">-- Choose Hotel 2 --</option>
            {allProperties.map(function(p) {
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {item1 && item2 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #999", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ border: "1px solid #ccc", padding: "10px", width: "24%" }}>Attribute</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", width: "38%", fontWeight: "bold" }}>{item1.name}</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", width: "38%", fontWeight: "bold" }}>{item2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>ID</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.id}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.id}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Type / Category</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.type || "Hotel"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.type || "Hotel"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>City</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.city}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.city}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Country</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.country}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.country}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Price (per average dish/stay)</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold" }}>{item1.price} {item1.priceunit || "USD"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold" }}>{item2.price} {item2.priceunit || "USD"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Rating</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{Number(item1.rating || 0) === 0 ? "0 (NA)" : item1.rating}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{Number(item2.rating || 0) === 0 ? "0 (NA)" : item2.rating}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Status</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.status}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.status}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Manager Email</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item1.managerEmail || "N/A"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>{item2.managerEmail || "N/A"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px", fontWeight: "bold", background: "#fcfcfc" }}>Booking</td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>
                  <button
                    type="button"
                    onClick={function() { navigate(`/booking/${item1.id}`); }}
                    style={{ padding: "6px 12px", background: "#1f6f78", color: "#fff", border: "1px solid #14494f", borderRadius: "3px", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Book Now
                  </button>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px 10px" }}>
                  <button
                    type="button"
                    onClick={function() { navigate(`/booking/${item2.id}`); }}
                    style={{ padding: "6px 12px", background: "#1f6f78", color: "#fff", border: "1px solid #14494f", borderRadius: "3px", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: "20px", border: "1px dashed #aaa", textAlign: "center", color: "#666", background: "#fafafa" }}>
          Please select both hotels from the dropdown menus above to generate the comparison table.
        </div>
      )}
    </div>
  );
}
