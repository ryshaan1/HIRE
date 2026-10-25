import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, getSession, setSession, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo } from "../../utils/pricing.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import StarRating from "../common/StarRating.jsx";
import PropertyTabs from "../common/PropertyTabs.jsx";
import ReportModal from "../common/ReportModal.jsx";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [property, setProperty] = useState(function() {
    const allProps = getShared("hire_properties", initialProperties);
    return allProps.find(function(p) { return String(p.id) === String(id); }) || null;
  });
  const [reviews, setReviews] = useState(function() {
    const allReviews = getShared("hire_reviews", []);
    return allReviews.filter(function(r) { return String(r.propertyId) === String(id); });
  });
  const [compareList, setCompareList] = useState(function() {
    return getSession("hire_compare", []);
  });
  const [compareMsg, setCompareMsg] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const allProps = getShared("hire_properties", initialProperties);
      setProperty(allProps.find(function(p) { return String(p.id) === String(id); }) || null);
      const allReviews = getShared("hire_reviews", []);
      setReviews(allReviews.filter(function(r) { return String(r.propertyId) === String(id); }));
      setCompareList(getSession("hire_compare", []));
    });

    return unsubscribe;
  }, [id]);

  if (!property) {
    return (
      <div className="card p-5 text-center my-5 bg-white border shadow-sm">
        <h5 className="text-navy fw-bold">Property not found</h5>
        <p className="text-muted small">The requested venue does not exist or has been removed.</p>
        <Link to="/search" className="btn btn-sm btn-teal d-inline-block mx-auto">Return to Search</Link>
      </div>
    );
  }

  function handleToggleCompare() {
    if (!currentUser) { navigate("/login", { state: { from: location } }); return; }
    const exists = compareList.find(function(p) { return p.id === property.id; });
    let updated;
    if (exists) {
      updated = compareList.filter(function(p) { return p.id !== property.id; });
      setCompareMsg("");
    } else {
      if (compareList.length >= 2) {
        setCompareMsg("Comparison limit reached (max 2 properties). Remove one to add another.");
        setTimeout(function() { setCompareMsg(""); }, 3500);
        return;
      }
      updated = [...compareList, property];
      setCompareMsg("");
    }
    setCompareList(updated);
    setSession("hire_compare", updated);
    window.dispatchEvent(new Event("hire_compare_updated"));
  }

  const isCompared = compareList.some(function(p) { return p.id === property.id; });
  const priceInfo = formatPriceInfo(property);
  const isFlagged = property.status === "flagged";
  const isBanned = property.status === "banned";
  const mainImage = typeof property.images === "string" && property.images.length > 5
    ? property.images
    : (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.image || null);

  return (
    <div className="hire-details py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/search" className="text-muted small text-decoration-none">&larr; Back to search</Link>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={function() { setShowReportModal(true); }}>
          Report Venue
        </button>
      </div>

      {/* Moderation Alerts */}
      {isFlagged && (
        <div className="alert alert-warning border border-warning shadow-sm mb-3">
          <div className="d-flex align-items-start gap-2">
            <span className="fs-5">⚠️</span>
            <div>
              <strong>Platform Moderation Advisory:</strong> This venue has been flagged by platform administration.
              <div className="small mt-1">
                <strong>Flag Reason(s):</strong>
                <span className="d-inline-flex flex-wrap gap-1 align-items-center ms-1">
                  {(property.flagReason || "Compliance Flag").split(", ").map(function(r, idx) {
                    return <span key={idx} className="badge bg-danger text-white">{r}</span>;
                  })}
                </span>
                {property.flagNotes && <div className="mt-1 text-muted"><strong>Directive:</strong> {property.flagNotes}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {isBanned && (
        <div className="alert alert-danger border border-danger shadow-sm mb-3">
          <div className="d-flex align-items-start gap-2">
            <span className="fs-5">🚫</span>
            <div>
              <strong className="text-danger">VENUE BANNED BY ADMINISTRATION:</strong>
              <div className="small mt-1">
                This venue has been suspended from active operations due to:
                <span className="d-inline-flex flex-wrap gap-1 align-items-center ms-1">
                  {(property.banReason || "Terms of Service Violation").split(", ").map(function(r, idx) {
                    return <span key={idx} className="badge bg-danger text-white">{r}</span>;
                  })}
                </span>
                {property.banNotes && <div className="mt-1 text-danger-emphasis"><strong>Audit Details:</strong> {property.banNotes}</div>}
                <div className="mt-1 text-muted">Bookings and check-ins are not permitted. Critics may still audit and submit reviews.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {compareMsg && <div className="alert alert-warning py-2 px-3 small text-center mb-3">{compareMsg}</div>}

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8"><ImagePlaceholder height="280px" src={mainImage} /></div>
        <div className="col-12 col-md-4 d-flex flex-column gap-2">
          <ImagePlaceholder height="136px" src={mainImage} />
          <ImagePlaceholder height="136px" src={mainImage} />
        </div>
      </div>

      <div className="card shadow-sm border p-4 rounded bg-white mb-4">
        <div className="row align-items-center justify-content-between g-3">
          <div className="col-12 col-md-8">
            <h4 className="fw-bold text-navy mb-1">{property.name}</h4>
            <p className="text-muted small mb-2">{property.city}, {property.country} &bull; <span className="text-teal">{property.cuisine}</span></p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <StarRating rating={property.rating} />
              <span className="small fw-semibold">{property.rating > 0 ? Number(property.rating).toFixed(1) : "New"}</span>
              <span className="small text-muted">({property.reviewCount || 0} reviews)</span>
              {isFlagged && (
                <span className="badge bg-warning text-dark border ms-2">Flagged</span>
              )}
              {isBanned && (
                <span className="badge bg-danger ms-2">Banned</span>
              )}
            </div>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <div className="mb-2">
              <span className="fs-3 fw-bold text-teal">${priceInfo.hasDiscount ? priceInfo.discountedPrice : priceInfo.price}</span>
              {priceInfo.hasDiscount && <span className="text-muted text-decoration-line-through ms-2">${priceInfo.price}</span>}
              <span className="small text-muted">{priceInfo.unitDisplay}</span>
              {priceInfo.secondaryPrice && (
                <div className="text-secondary small fw-semibold mt-1">
                  ${priceInfo.secondaryPrice} <span className="text-muted fw-normal">({priceInfo.secondaryLabel})</span>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-md-end gap-2">
              {!isBanned && (
                <button type="button" className={`btn btn-sm ${isCompared ? "btn-outline-danger" : "btn-outline-teal"}`} onClick={handleToggleCompare}>
                  {isCompared ? "Remove Compare" : "+ Add to Compare"}
                </button>
              )}
              {isBanned ? (
                <button type="button" className="btn btn-sm btn-secondary px-3" disabled>
                  Bookings Suspended (Banned)
                </button>
              ) : (
                <button type="button" className="btn btn-sm btn-teal px-4" onClick={function() {
                  if (!currentUser) navigate("/login", { state: { from: location } });
                  else navigate(`/booking/${property.id}`);
                }}>Book Now</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PropertyTabs property={property} reviews={reviews} />
      {showReportModal && <ReportModal property={property} onClose={function() { setShowReportModal(false); }} />}
    </div>
  );
}
