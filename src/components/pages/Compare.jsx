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
  const [reviews, setReviews] = useState(function() {
    return getShared("hire_reviews", []);
  });
  const [compareList, setCompareList] = useState(function() {
    const props = getShared("hire_properties", initialProperties).filter(function(p) {
      return p.status !== "pending_admission";
    });
    const stored = getSession("hire_compare", []);
    return stored.map(function(i) { return props.find(function(p) { return String(p.id) === String(i.id); }) || i; });
  });

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const props = getShared("hire_properties", initialProperties).filter(function(p) {
        return p.status !== "pending_admission";
      });
      setAllProperties(props);
      setReviews(getShared("hire_reviews", []));
      const stored = getSession("hire_compare", []);
      setCompareList(stored.map(function(i) { return props.find(function(p) { return String(p.id) === String(i.id); }) || i; }));
    });

    return unsubscribe;
  }, []);

  function saveCompare(updated) {
    setCompareList(updated);
    setSession("hire_compare", updated);
    window.dispatchEvent(new Event("hire_compare_updated"));
  }

  function handleSelectSlot(idx, pid) {
    const s = allProperties.find(function(p) { return String(p.id) === String(pid); });
    if (!s) return;
    const next = [...compareList];
    next[idx] = s;
    saveCompare(next);
  }

  function getRating(p) {
    const r = reviews.filter(function(x) { return String(x.propertyId) === String(p.id); });
    if (r.length === 0) return Number(p.rating || 0);
    return Number((r.reduce(function(acc, val) { return acc + Number(val.rating); }, 0) / r.length).toFixed(1));
  }

  const p1 = compareList[0];
  const p2 = compareList[1];
  const info1 = p1 ? formatPriceInfo(p1) : null;
  const info2 = p2 ? formatPriceInfo(p2) : null;
  const pr1 = info1 ? (info1.hasDiscount ? info1.discountedPrice : info1.price) : 0;
  const pr2 = info2 ? (info2.hasDiscount ? info2.discountedPrice : info2.price) : 0;
  const rt1 = p1 ? getRating(p1) : 0;
  const rt2 = p2 ? getRating(p2) : 0;

  return (
    <div className="hire-compare py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-navy mb-0">Comparing Properties</h4>
        <span className="small text-muted">{compareList.length} of 2 selected</span>
      </div>

      {(!p1 || !p2) && (
        <div className="card shadow-sm border p-3 rounded bg-white mb-4">
          <p className="small text-secondary mb-2">Pick two properties to compare side by side:</p>
          <div className="row g-2">
            {[0, 1].map(function(slot) {
              const current = compareList[slot];
              return (
                <div className="col-12 col-md-6" key={slot}>
                  <label className="form-label small text-muted">Property {slot + 1}</label>
                  <select className="form-select form-select-sm" value={current ? current.id : ""} onChange={function(e) { handleSelectSlot(slot, e.target.value); }}>
                    <option value="">Select Property {slot + 1}...</option>
                    {allProperties.map(function(item) {
                      return <option key={item.id} value={item.id}>{item.name} ({item.city}) - ${item.price}</option>;
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {p1 && p2 && (
        <div className="table-responsive card shadow-sm border rounded bg-white mb-4">
          <table className="table table-bordered align-middle mb-0">
            <thead>
              <tr className="bg-light">
                <th style={{ width: "24%" }} className="small text-muted">Feature</th>
                {[p1, p2].map(function(p) {
                  return (
                    <th key={p.id} style={{ width: "38%" }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="fw-bold text-navy">{p.name}</span>
                        <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={function() { saveCompare(compareList.filter(function(x) { return x.id !== p.id; })); }}>Remove</button>
                      </div>
                      <ImagePlaceholder height="110px" src={p.images && p.images[0]} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="small">
              <tr>
                <td className="fw-semibold text-muted">Type</td>
                <td>{p1.type}</td>
                <td>{p2.type}</td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Status</td>
                <td>
                  <span className={`badge ${p1.status === "active" ? "bg-success" : p1.status === "flagged" ? "bg-warning text-dark" : "bg-danger"}`}>
                    {p1.status}
                  </span>
                  {p1.flagReason && <div className="text-muted small mt-1">Flag: {p1.flagReason}</div>}
                  {p1.banReason && <div className="text-danger small mt-1">Ban: {p1.banReason}</div>}
                </td>
                <td>
                  <span className={`badge ${p2.status === "active" ? "bg-success" : p2.status === "flagged" ? "bg-warning text-dark" : "bg-danger"}`}>
                    {p2.status}
                  </span>
                  {p2.flagReason && <div className="text-muted small mt-1">Flag: {p2.flagReason}</div>}
                  {p2.banReason && <div className="text-danger small mt-1">Ban: {p2.banReason}</div>}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Location</td>
                <td>{p1.city}, {p1.country}</td>
                <td>{p2.city}, {p2.country}</td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Pricing &amp; Rate Structure</td>
                <td className={pr1 < pr2 ? "bg-success-subtle fw-bold text-success" : ""}>
                  <div>${pr1} {info1 && info1.unitDisplay} {pr1 < pr2 && <span className="badge bg-success ms-1">Better Value</span>}</div>
                  {info1 && info1.secondaryPrice && (
                    <div className="text-muted small fw-normal">Tier: ${info1.secondaryPrice} ({info1.secondaryLabel})</div>
                  )}
                </td>
                <td className={pr2 < pr1 ? "bg-success-subtle fw-bold text-success" : ""}>
                  <div>${pr2} {info2 && info2.unitDisplay} {pr2 < pr1 && <span className="badge bg-success ms-1">Better Value</span>}</div>
                  {info2 && info2.secondaryPrice && (
                    <div className="text-muted small fw-normal">Tier: ${info2.secondaryPrice} ({info2.secondaryLabel})</div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Average Rating</td>
                <td className={rt1 > rt2 ? "bg-success-subtle fw-bold" : ""}><StarRating rating={rt1} /> {rt1} {rt1 > rt2 && <span className="badge bg-teal ms-1">Top Rated</span>}</td>
                <td className={rt2 > rt1 ? "bg-success-subtle fw-bold" : ""}><StarRating rating={rt2} /> {rt2} {rt2 > rt1 && <span className="badge bg-teal ms-1">Top Rated</span>}</td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Reviews</td>
                <td>{p1.reviewCount || 0} reviews</td>
                <td>{p2.reviewCount || 0} reviews</td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Amenities</td>
                {[p1, p2].map(function(p, i) {
                  return (
                    <td key={i}>
                      {p.amenities && p.amenities.filter(function(a) { return a.available; }).map(function(a) {
                        return <span key={a.name} className={`badge me-1 mb-1 ${a.underRepair ? "bg-warning text-dark" : "bg-light text-dark border"}`}>{a.name}{a.underRepair ? " (Repair)" : ""}</span>;
                      })}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Cuisine Type</td>
                <td>{p1.cuisine || "International"}</td>
                <td>{p2.cuisine || "International"}</td>
              </tr>
              <tr>
                <td className="fw-semibold text-muted">Action</td>
                <td>
                  {p1.status === "banned" ? (
                    <button type="button" className="btn btn-sm btn-secondary w-100" disabled>Banned</button>
                  ) : (
                    <button type="button" className="btn btn-sm btn-teal w-100" onClick={function() { navigate(`/booking/${p1.id}`); }}>Book This</button>
                  )}
                </td>
                <td>
                  {p2.status === "banned" ? (
                    <button type="button" className="btn btn-sm btn-secondary w-100" disabled>Banned</button>
                  ) : (
                    <button type="button" className="btn btn-sm btn-teal w-100" onClick={function() { navigate(`/booking/${p2.id}`); }}>Book This</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
