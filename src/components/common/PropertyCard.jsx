import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "./ImagePlaceholder.jsx";
import StarRating from "./StarRating.jsx";
import { formatPriceInfo, getSelectedCurrency } from "../../utils/pricing.js";

export default function PropertyCard({ property, isCompared, onToggleCompare }) {
  const [currency, setCurrency] = useState(function() {
    return getSelectedCurrency();
  });

  useEffect(function() {
    function handleCurrencyChange() {
      setCurrency(getSelectedCurrency());
    }
    window.addEventListener("hire_currency_changed", handleCurrencyChange);
    return function() {
      window.removeEventListener("hire_currency_changed", handleCurrencyChange);
    };
  }, []);

  const photo = typeof property.images === "string" && property.images.length > 5 
    ? property.images 
    : (Array.isArray(property.images) && property.images.length > 0 
      ? property.images[0] 
      : (property.image || null));
  const priceInfo = formatPriceInfo(property, currency);
  const isFlagged = property.status === "flagged";
  const isBanned = property.status === "banned";

  return (
    <div className={`card hire-card h-100 shadow-sm border ${isBanned ? "border-danger bg-light" : ""}`}>
      <div className="position-relative">
        <ImagePlaceholder height="160px" src={photo} />
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-wrap gap-1">
          <span className="badge bg-teal">{property.type}</span>
          {isFlagged && (
            <span className="badge bg-warning text-dark border shadow-sm" title={property.flagReason || "Flagged"}>
              Flagged: {property.flagReason || "Advisory"}
            </span>
          )}
          {isBanned && (
            <span className="badge bg-danger shadow-sm" title={property.banReason || "Banned"}>
              BANNED: {property.banReason || "Policy Violation"}
            </span>
          )}
          {priceInfo.hasDiscount && !isBanned && (
            <span className="badge bg-warning text-dark">{property.discount}% OFF</span>
          )}
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <h6 className="card-title fw-semibold text-navy mb-1 text-truncate">
            {property.name}
          </h6>
          <p className="text-muted small mb-2 text-truncate">
            {property.city}, {property.country} &bull; <span className="text-teal">{property.cuisine}</span>
          </p>

          <div className="d-flex align-items-center gap-1 mb-2">
            <StarRating rating={property.rating} />
            <span className="small fw-semibold text-dark ms-1">
              {property.rating > 0 ? Number(property.rating).toFixed(1) : "New"}
            </span>
            <span className="small text-muted">
              ({property.reviewCount || 0})
            </span>
            {isBanned && (
              <span className="badge bg-danger-subtle text-danger ms-auto" style={{ fontSize: "0.68rem" }}>
                Bookings Suspended
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3">
            <div className="d-flex flex-wrap align-items-baseline gap-1">
              {priceInfo.hasDiscount ? (
                <>
                  <span className="fs-6 fw-bold text-teal">{priceInfo.displayPrice}</span>
                  <span className="small text-muted text-decoration-line-through">{priceInfo.originalDisplayPrice}</span>
                  <span className="small text-muted">{priceInfo.unitDisplay}</span>
                </>
              ) : (
                <>
                  <span className="fs-6 fw-bold text-teal">{priceInfo.displayPrice}</span>
                  <span className="small text-muted">{priceInfo.unitDisplay}</span>
                </>
              )}
            </div>
            {priceInfo.secondaryDisplayPrice && (
              <div className="small text-secondary fw-semibold mt-1">
                {priceInfo.secondaryDisplayPrice} <span className="text-muted fw-normal">({priceInfo.secondaryLabel})</span>
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/property/${property.id}`}
              className={`btn btn-sm flex-grow-1 ${isBanned ? "btn-outline-danger" : "btn-teal"}`}
            >
              {isBanned ? "Inspect Venue" : "View Details"}
            </Link>
            {onToggleCompare && !isBanned && (
              <button
                type="button"
                className={`btn btn-sm ${isCompared ? "btn-outline-danger" : "btn-outline-teal"}`}
                onClick={function() { onToggleCompare(property); }}
                title={isCompared ? "Remove from comparison" : "Add to comparison"}
              >
                {isCompared ? "Compared" : "+ Compare"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
