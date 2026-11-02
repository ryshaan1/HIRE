import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, getSession, setSession, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo } from "../../utils/pricing.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import StarRating from "../common/StarRating.jsx";
import FaqAccordion from "../common/FaqAccordion.jsx";
import ReportModal from "../common/ReportModal.jsx";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [property, setProperty] = useState(function() {
    const list = getShared("hire_properties", initialProperties);
    return list.find(function(p) { return String(p.id) === String(id); }) || list[0];
  });
  const [compareList, setCompareList] = useState(function() {
    return getSession("hire_compare", []);
  });
  const [compareMsg, setCompareMsg] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const list = getShared("hire_properties", initialProperties);
      const found = list.find(function(p) { return String(p.id) === String(id); });
      if (found) setProperty(found);
      setCompareList(getSession("hire_compare", []));
    });

    return unsubscribe;
  }, [id]);

  if (!property) return <div className="p-4 text-center">Loading venue details...</div>;

  const isFlagged = property.status === "flagged";
  const isBanned = property.status === "banned";
  const isCompared = compareList.some(function(c) { return c.id === property.id; });
  const priceInfo = formatPriceInfo(property);

  function handleToggleCompare() {
    let updated;
    if (isCompared) {
      updated = compareList.filter(function(p) { return p.id !== property.id; });
      setCompareMsg("");
    } else {
      if (compareList.length >= 2) {
        setCompareMsg("Comparison limit reached (max 2 properties).");
        setTimeout(function() { setCompareMsg(""); }, 3000);
        return;
      }
      updated = [...compareList, property];
      setCompareMsg("");
    }
    setCompareList(updated);
    setSession("hire_compare", updated);
    window.dispatchEvent(new Event("hire_compare_updated"));
  }

  const mainImage = typeof property.images === "string" && property.images.length > 5
    ? property.images
    : (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.image || null);

  const rules = property.rules || {
    paymentMethod: "Cash at Check-in & Credit/Debit Card",
    advancePercent: 50,
    acceptedCurrencies: `${priceInfo.currency.code}, USD`,
    currencySurcharge: "3.5% foreign currency exchange fee applies",
    cancellationPolicy: "Cancellations allowed up to 48 hours prior to check-in. Repeated booking and cancellations may trigger account restriction.",
    customRules: ["Valid government ID required at check-in", "Quiet hours observed from 10:00 PM to 07:00 AM", "No unauthorized commercial shooting"]
  };

  return (
    <div className="hire-details py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/search" className="text-muted small text-decoration-none">&larr; Back to search</Link>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={function() { setShowReportModal(true); }}>
          Report Venue
        </button>
      </div>

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
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-teal">{property.type}</span>
              <span className="text-muted small">{property.city}, {property.country}</span>
            </div>
            <h3 className="fw-bold text-navy mb-1">{property.name}</h3>
            <p className="text-muted small mb-2">{property.address || property.city}</p>
            <div className="d-flex align-items-center gap-1 mb-2">
              <StarRating rating={property.rating} />
              <span className="small fw-semibold">{property.rating > 0 ? Number(property.rating).toFixed(1) : "New"}</span>
              <span className="small text-muted">({property.reviewCount || 0} reviews)</span>
              {isFlagged && <span className="badge bg-warning text-dark border ms-2">Flagged</span>}
              {isBanned && <span className="badge bg-danger ms-2">Banned</span>}
            </div>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <div className="mb-2">
              <div className="fs-4 fw-bold text-teal">{priceInfo.displayPrice}</div>
              {priceInfo.hasDiscount && (
                <div className="text-muted small text-decoration-line-through">{priceInfo.originalDisplayPrice}</div>
              )}
              <div className="small text-muted">{priceInfo.unitDisplay}</div>
            </div>
            <div className="d-flex justify-content-md-end gap-2 flex-wrap">
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
                }}>
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div className="card shadow-sm border p-4 rounded bg-white mb-4">
            <h5 className="fw-bold text-navy mb-3">About this venue</h5>
            <p className="text-secondary small leading-relaxed">{property.description}</p>
            <hr />
            <h6 className="fw-bold text-navy mb-2">Amenities & Services</h6>
            <div className="d-flex flex-wrap gap-2">
              {(property.amenities || []).map(function(amenity, idx) {
                const isUnderRepair = typeof amenity === "object" ? amenity.underRepair : false;
                const name = typeof amenity === "object" ? amenity.name : amenity;
                return (
                  <span
                    key={idx}
                    className={`badge ${isUnderRepair ? "bg-warning text-dark" : "bg-light text-dark border"}`}
                  >
                    {name} {isUnderRepair && "(Under Repair)"}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="card shadow-sm border p-4 rounded bg-white">
            <h5 className="fw-bold text-navy mb-3">Venue Rules & Booking Policies</h5>
            <div className="small text-secondary mb-3">
              <div className="mb-2"><strong>Accepted Payment Modes:</strong> {rules.paymentMethod}</div>
              <div className="mb-2"><strong>Accepted Currencies:</strong> {rules.acceptedCurrencies}</div>
              <div className="mb-2"><strong>Advance Payment Requirement:</strong> {rules.advancePercent}% deposit required</div>
              <div className="mb-2"><strong>Foreign Currency Policy:</strong> {rules.currencySurcharge}</div>
              <div className="mb-2"><strong>Cancellation & Abuse Policy:</strong> {rules.cancellationPolicy}</div>
            </div>
            {rules.customRules && rules.customRules.length > 0 && (
              <div>
                <strong className="small text-dark d-block mb-1">House Rules:</strong>
                <ul className="small text-muted mb-0 ps-3">
                  {rules.customRules.map(function(r, idx) {
                    return <li key={idx} className="mb-1">{r}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card shadow-sm border p-4 rounded bg-white mb-4">
            <h5 className="fw-bold text-navy mb-3">Frequently Asked Questions</h5>
            <FaqAccordion faqs={property.faqs} />
          </div>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          property={property}
          onClose={function() { setShowReportModal(false); }}
        />
      )}
    </div>
  );
}
