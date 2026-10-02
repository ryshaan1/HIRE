import { useState } from "react";

export default function ManagerDiscounts({ property, onSave }) {
  const [discount, setDiscount] = useState(property.discount || 0);
  const [seasonal, setSeasonal] = useState(
    property.seasonalOffer || { name: "", startDate: "", endDate: "", percent: 0 }
  );
  const [message, setMessage] = useState("");

  const originalPrice = property.price || 100;
  const finalPrice = Math.round(originalPrice * (1 - discount / 100));

  function handleSave(e) {
    e.preventDefault();
    const updated = {
      ...property,
      discount: Number(discount),
      seasonalOffer: seasonal.name ? seasonal : null
    };
    onSave(updated);
    setMessage("Discounts updated successfully!");
    setTimeout(function() {
      setMessage("");
    }, 3000);
  }

  return (
    <form onSubmit={handleSave} className="card shadow-sm border p-4 rounded bg-white mb-4">
      <h6 className="fw-bold text-navy mb-2">Set Property Discount</h6>
      <p className="text-muted small mb-4">
        Apply a percentage discount to your listing price. Discounted properties are highlighted across search.
      </p>

      {message && (
        <div className="alert alert-success py-2 px-3 small mb-3">
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="form-label small fw-semibold text-navy">
          Discount Percentage: <strong className="text-teal fs-5">{discount}%</strong>
        </label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="60"
          step="5"
          value={discount}
          onChange={function(e) { setDiscount(Number(e.target.value)); }}
        />
        <div className="d-flex justify-content-between text-muted small mt-1">
          <span>0% (Regular)</span>
          <span>Original: ${originalPrice} &rarr; <strong>New: ${finalPrice}</strong> / night</span>
          <span>60%</span>
        </div>
      </div>

      <div className="border-top pt-3 mb-4">
        <h6 className="fw-bold text-navy mb-2">Seasonal / Limited Time Offer</h6>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted">Offer Name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. Autumn Getaway, Monsoon Fest"
              value={seasonal.name}
              onChange={function(e) { setSeasonal({ ...seasonal, name: e.target.value }); }}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small text-muted">Extra Discount %</label>
            <input
              type="number"
              min="0"
              max="50"
              className="form-control form-control-sm"
              value={seasonal.percent}
              onChange={function(e) { setSeasonal({ ...seasonal, percent: Number(e.target.value) }); }}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small text-muted">Start Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={seasonal.startDate}
              onChange={function(e) { setSeasonal({ ...seasonal, startDate: e.target.value }); }}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small text-muted">End Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={seasonal.endDate}
              onChange={function(e) { setSeasonal({ ...seasonal, endDate: e.target.value }); }}
            />
          </div>
        </div>
      </div>

      <div className="text-end">
        <button type="submit" className="btn btn-teal px-4">
          Apply Discount
        </button>
      </div>
    </form>
  );
}
