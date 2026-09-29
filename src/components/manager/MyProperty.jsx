import { useState } from "react";
import PhotoUploader from "./PhotoUploader.jsx";
import AmenityToggles from "./AmenityToggles.jsx";
import FaqEditor from "./FaqEditor.jsx";
import { RATE_CATEGORIES, getPropertyPriceUnit } from "../../utils/pricing.js";

export default function MyProperty({ property, onSave, isBanned }) {
  const initialUnit = getPropertyPriceUnit(property);

  const [formData, setFormData] = useState({
    name: property.name || "",
    types: property.type ? property.type.split(", ").map(function(s) { return s.trim(); }) : ["Hotel"],
    city: property.city || "",
    country: property.country || "",
    branches: property.branches || 1,
    description: property.description || "",
    price: property.price || 100,
    priceUnit: initialUnit,
    hasSecondary: Boolean(property.secondaryPrice),
    secondaryPrice: property.secondaryPrice || "",
    secondaryPriceLabel: property.secondaryPriceLabel || "",
    openTime: property.openTime || "07:00 AM",
    closeTime: property.closeTime || "11:00 PM",
    cuisine: property.cuisine || "",
    amenities: property.amenities || [],
    faqs: property.faqs || [],
    images: property.images || []
  });
  const [savedMsg, setSavedMsg] = useState(false);

  // React recommended pattern: adjust state during rendering when prop reference changes
  const [prevProperty, setPrevProperty] = useState(property);
  if (property !== prevProperty) {
    setPrevProperty(property);
    setFormData({
      name: property.name || "",
      types: property.type ? property.type.split(", ").map(function(s) { return s.trim(); }) : ["Hotel"],
      city: property.city || "",
      country: property.country || "",
      branches: property.branches || 1,
      description: property.description || "",
      price: property.price || 100,
      priceUnit: getPropertyPriceUnit(property),
      hasSecondary: Boolean(property.secondaryPrice),
      secondaryPrice: property.secondaryPrice || "",
      secondaryPriceLabel: property.secondaryPriceLabel || "",
      openTime: property.openTime || "07:00 AM",
      closeTime: property.closeTime || "11:00 PM",
      cuisine: property.cuisine || "",
      amenities: property.amenities || [],
      faqs: property.faqs || [],
      images: property.images || []
    });
  }

  function handleTypeToggle(t) {
    let nextTypes = formData.types.includes(t)
      ? (formData.types.length > 1 ? formData.types.filter(function(i) { return i !== t; }) : formData.types)
      : [...formData.types, t];
    setFormData({ ...formData, types: nextTypes });
  }

  function handlePhotosUpdate(imgs) {
    const nextFormData = { ...formData, images: imgs };
    setFormData(nextFormData);

    // Save and sync immediately to other tabs
    if (!isBanned) {
      const payload = {
        ...property,
        ...nextFormData,
        type: nextFormData.types.join(", "),
        price: Number(nextFormData.price),
        priceUnit: nextFormData.priceUnit,
        images: imgs,
        secondaryPrice: nextFormData.hasSecondary && nextFormData.secondaryPrice ? Number(nextFormData.secondaryPrice) : null,
        secondaryPriceLabel: nextFormData.hasSecondary && nextFormData.secondaryPrice ? nextFormData.secondaryPriceLabel.trim() : null
      };
      onSave(payload);
      setSavedMsg(true);
      setTimeout(function() { setSavedMsg(false); }, 3000);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isBanned) return;

    const payload = {
      ...property,
      ...formData,
      type: formData.types.join(", "),
      price: Number(formData.price),
      priceUnit: formData.priceUnit,
      secondaryPrice: formData.hasSecondary && formData.secondaryPrice ? Number(formData.secondaryPrice) : null,
      secondaryPriceLabel: formData.hasSecondary && formData.secondaryPrice ? formData.secondaryPriceLabel.trim() : null
    };

    onSave(payload);
    setSavedMsg(true);
    setTimeout(function() { setSavedMsg(false); }, 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {savedMsg && <div className="alert alert-success py-2 px-3 small mb-3">✓ Property details and photos saved! Synced across all tabs.</div>}
      {isBanned && (
        <div className="alert alert-danger py-2 px-3 small mb-3">
          🚫 Listing changes are locked because this venue has been banned by platform administration.
        </div>
      )}

      {/* Photo Uploader with PC File Picker and Direct Clipboard Paste */}
      <PhotoUploader
        photos={formData.images}
        onPhotosChange={handlePhotosUpdate}
        disabled={isBanned}
        maxPhotos={4}
      />

      {/* Pricing and Category Configuration */}
      <div className="card shadow-sm border p-3 mb-4 rounded bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-navy mb-0">Pricing &amp; Rate Structure</h6>
          <span className="badge bg-light text-muted border">Custom Category Selector</span>
        </div>
        <p className="text-muted small mb-3">
          Configure how rates are categorized (e.g. per night for stays, per day for passes, average per dish for dining, or starting entry). You can also add a secondary package such as a weekly package or grand buffet.
        </p>

        <div className="row g-3">
          <div className="col-12 col-md-5">
            <label className="form-label small fw-semibold text-muted mb-1">Base Price ($)</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text">$</span>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.price}
                onChange={function(e) { setFormData({ ...formData, price: e.target.value }); }}
                disabled={isBanned}
                required
              />
            </div>
          </div>

          <div className="col-12 col-md-7">
            <label className="form-label small fw-semibold text-muted mb-1">Select Rate Category / Unit</label>
            <select
              className="form-select form-select-sm"
              value={formData.priceUnit}
              onChange={function(e) { setFormData({ ...formData, priceUnit: e.target.value }); }}
              disabled={isBanned}
            >
              {RATE_CATEGORIES.map(function(cat) {
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} &mdash; {cat.desc}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Secondary Tier / Package */}
          <div className="col-12 mt-2">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="toggleSecondaryPrice"
                checked={formData.hasSecondary}
                onChange={function(e) { setFormData({ ...formData, hasSecondary: e.target.checked }); }}
                disabled={isBanned}
              />
              <label className="form-check-label small fw-semibold text-dark" htmlFor="toggleSecondaryPrice">
                Add secondary tier or package (e.g. $150 Weekly stay or $400 Grand Buffet)
              </label>
            </div>

            {formData.hasSecondary && (
              <div className="p-3 border rounded bg-light">
                <div className="row g-2">
                  <div className="col-12 col-md-4">
                    <label className="form-label small text-muted mb-1">Package Price ($)</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="e.g. 150 or 400"
                        value={formData.secondaryPrice}
                        onChange={function(e) { setFormData({ ...formData, secondaryPrice: e.target.value }); }}
                        disabled={isBanned}
                        required={formData.hasSecondary}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-8">
                    <label className="form-label small text-muted mb-1">Package / Tier Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Weekly Stay, Grand Buffet, 3-Course Feast"
                      value={formData.secondaryPriceLabel}
                      onChange={function(e) { setFormData({ ...formData, secondaryPriceLabel: e.target.value }); }}
                      disabled={isBanned}
                      required={formData.hasSecondary}
                    />
                  </div>
                </div>
                <div className="small text-muted mt-2">
                  Preview on listing cards:
                  <strong className="text-teal ms-1">${formData.price} {formData.priceUnit}</strong>
                  {formData.secondaryPrice && (
                    <span className="ms-2">
                      | Below: <strong className="text-navy">${formData.secondaryPrice} {formData.secondaryPriceLabel || "Package"}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card shadow-sm border p-3 mb-4 rounded bg-white">
        <h6 className="fw-bold text-navy mb-3">Core Information</h6>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted mb-1">Property Name</label>
            <input type="text" className="form-control form-control-sm" value={formData.name} onChange={function(e) { setFormData({ ...formData, name: e.target.value }); }} disabled={isBanned} required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted mb-1">Business Type</label>
            <div className="d-flex gap-3 pt-1">
              {["Hotel", "Inn", "Restaurant"].map(function(t) {
                return (
                  <div className="form-check" key={t}>
                    <input className="form-check-input" type="checkbox" id={`t-${t}`} checked={formData.types.includes(t)} onChange={function() { handleTypeToggle(t); }} disabled={isBanned} />
                    <label className="form-check-label small" htmlFor={`t-${t}`}>{t}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small text-muted mb-1">City</label>
            <input type="text" className="form-control form-control-sm" value={formData.city} onChange={function(e) { setFormData({ ...formData, city: e.target.value }); }} disabled={isBanned} required />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small text-muted mb-1">Country</label>
            <input type="text" className="form-control form-control-sm" value={formData.country} onChange={function(e) { setFormData({ ...formData, country: e.target.value }); }} disabled={isBanned} required />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small text-muted mb-1">Branches (Optional)</label>
            <input type="number" min="1" className="form-control form-control-sm" value={formData.branches} onChange={function(e) { setFormData({ ...formData, branches: Number(e.target.value) }); }} disabled={isBanned} />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small text-muted mb-1">Opening Time</label>
            <input type="text" className="form-control form-control-sm" value={formData.openTime} onChange={function(e) { setFormData({ ...formData, openTime: e.target.value }); }} disabled={isBanned} />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small text-muted mb-1">Closing Time</label>
            <input type="text" className="form-control form-control-sm" value={formData.closeTime} onChange={function(e) { setFormData({ ...formData, closeTime: e.target.value }); }} disabled={isBanned} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small text-muted mb-1">Famous Cuisine / Best Dish</label>
            <input type="text" className="form-control form-control-sm" value={formData.cuisine} onChange={function(e) { setFormData({ ...formData, cuisine: e.target.value }); }} disabled={isBanned} />
          </div>
          <div className="col-12">
            <label className="form-label small text-muted mb-1">Description</label>
            <textarea className="form-control form-control-sm" rows="3" value={formData.description} onChange={function(e) { setFormData({ ...formData, description: e.target.value }); }} disabled={isBanned} required></textarea>
          </div>
        </div>
      </div>

      <AmenityToggles amenities={formData.amenities} onChange={function(amList) { setFormData({ ...formData, amenities: amList }); }} disabled={isBanned} />
      <FaqEditor faqs={formData.faqs} onChange={function(faqList) { setFormData({ ...formData, faqs: faqList }); }} disabled={isBanned} />

      <div className="text-end mb-4">
        <button type="submit" className="btn btn-teal px-4" disabled={isBanned}>
          Save All Changes
        </button>
      </div>
    </form>
  );
}
