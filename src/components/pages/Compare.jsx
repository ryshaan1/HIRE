import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getShared, getSession, setSession, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo } from "../../utils/pricing.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import StarRating from "../common/StarRating.jsx";

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

  function handleRemove(slotIndex) {
    const next = [...compareList];
    next.splice(slotIndex, 1);
    saveCompare(next);
  }

  const p1 = compareList[0] || null;
  const p2 = compareList[1] || null;

  function renderSlot(prop, slotIndex) {
    return (
      <div className="card shadow-sm border rounded bg-white p-3 h-100">
        <div className="mb-3">
          <select
            className="form-select form-select-sm"
            value={prop ? prop.id : ""}
            onChange={function(e) { handleSelect(slotIndex, e.target.value); }}
          >
            <option value="">-- Choose property to compare --</option>
            {allProperties.map(function(item) {
              return (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.city}, {item.country})
                </option>
              );
            })}
          </select>
        </div>

        {prop ? (
          <div>
            <div className="position-relative mb-2">
              <ImagePlaceholder height="140px" src={Array.isArray(prop.images) && prop.images.length > 0 ? prop.images[0] : prop.image} />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1"
                onClick={function() { handleRemove(slotIndex); }}
              >
                &times;
              </button>
            </div>
            <h6 className="fw-bold text-navy mb-1">{prop.name}</h6>
            <div className="small text-muted mb-2">{prop.city}, {prop.country} &bull; {prop.type}</div>
            <div className="d-flex align-items-center gap-1 mb-2">
              <StarRating rating={prop.rating} />
              <span className="small fw-semibold">{prop.rating > 0 ? Number(prop.rating).toFixed(1) : "New"}</span>
            </div>
            <div className="mb-3">
              <span className="fw-bold text-teal">{formatPriceInfo(prop).displayPrice}</span>
              <span className="small text-muted">{formatPriceInfo(prop).unitDisplay}</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-teal w-100"
              onClick={function() { navigate(`/property/${prop.id}`); }}
            >
              Inspect Details
            </button>
          </div>
        ) : (
          <div className="text-center text-muted py-5 small">
            Select a property from the dropdown above to benchmark specifications.
          </div>
        )}
      </div>
    );
  }

  const commonAmenities = ["Free WiFi", "Pool", "Gym", "Restaurant", "Parking", "Room Service", "Bar", "Spa"];

  return (
    <div className="hire-compare py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-navy mb-0">Side-by-Side Venue Comparison</h4>
          <span className="small text-muted">Benchmark rates, ratings, and amenities across venues</span>
        </div>
        {compareList.length > 0 && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={function() { saveCompare([]); }}>
            Clear Comparison
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">{renderSlot(p1, 0)}</div>
        <div className="col-12 col-md-6">{renderSlot(p2, 1)}</div>
      </div>

      {p1 && p2 && (
        <div className="card shadow-sm border rounded bg-white p-3">
          <h6 className="fw-bold text-navy mb-3">Specification Benchmark Matrix</h6>
          <div className="table-responsive">
            <table className="table table-bordered table-sm align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "30%" }}>Feature</th>
                  <th style={{ width: "35%" }}>{p1.name}</th>
                  <th style={{ width: "35%" }}>{p2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">Rate & Currency</td>
                  <td className="text-teal fw-bold">{formatPriceInfo(p1).displayPrice} {formatPriceInfo(p1).unitDisplay}</td>
                  <td className="text-teal fw-bold">{formatPriceInfo(p2).displayPrice} {formatPriceInfo(p2).unitDisplay}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Location</td>
                  <td>{p1.city}, {p1.country}</td>
                  <td>{p2.city}, {p2.country}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Critic Score</td>
                  <td>{p1.rating > 0 ? `${Number(p1.rating).toFixed(1)} / 5.0` : "Unrated"}</td>
                  <td>{p2.rating > 0 ? `${Number(p2.rating).toFixed(1)} / 5.0` : "Unrated"}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Operating Hours</td>
                  <td>{p1.openTime || "07:00 AM"} - {p1.closeTime || "11:00 PM"}</td>
                  <td>{p2.openTime || "07:00 AM"} - {p2.closeTime || "11:00 PM"}</td>
                </tr>
                {commonAmenities.map(function(amenity) {
                  const hasP1 = (p1.amenities || []).some(function(a) {
                    const name = typeof a === "object" ? a.name : a;
                    return name && name.toLowerCase() === amenity.toLowerCase();
                  });
                  const hasP2 = (p2.amenities || []).some(function(a) {
                    const name = typeof a === "object" ? a.name : a;
                    return name && name.toLowerCase() === amenity.toLowerCase();
                  });
                  return (
                    <tr key={amenity}>
                      <td className="fw-semibold">{amenity}</td>
                      <td>{hasP1 ? "Yes" : "No"}</td>
                      <td>{hasP2 ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
