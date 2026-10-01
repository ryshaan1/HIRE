import { useState } from "react";
import StarRating from "./StarRating.jsx";
import FaqAccordion from "./FaqAccordion.jsx";

export default function PropertyTabs({ property, reviews = [] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const latestTwo = reviews.slice(0, 2);

  return (
    <div className="card shadow-sm border rounded bg-white mt-4">
      <div className="card-header bg-white border-bottom p-0">
        <ul className="nav nav-tabs border-0 px-3 pt-2">
          {["overview", "amenities", "reviews", "availability", "faqs"].map(function(t) {
            return (
              <li className="nav-item" key={t}>
                <button
                  type="button"
                  className={`nav-link text-capitalize small fw-semibold border-0 ${
                    activeTab === t ? "active text-teal border-bottom border-teal border-2" : "text-muted"
                  }`}
                  onClick={function() { setActiveTab(t); }}
                >
                  {t} {t === "reviews" && `(${reviews.length})`}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card-body p-4">
        {activeTab === "overview" && (
          <div>
            <h6 className="fw-bold text-navy mb-2">About {property.name}</h6>
            <p className="text-secondary small mb-4">{property.description}</p>
            <div className="row g-3">
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Type</span><span className="small fw-semibold">{property.type}</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Location</span><span className="small fw-semibold">{property.city}, {property.country}</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Hours</span><span className="small fw-semibold">{property.openTime || "07:00 AM"} &ndash; {property.closeTime || "11:00 PM"}</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Cuisine Type</span><span className="small fw-semibold text-teal">{property.cuisine || "International"}</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Rating &amp; Reviews</span><span className="small fw-semibold">★ {property.rating > 0 ? Number(property.rating).toFixed(1) : "New"} ({property.reviewCount || 0})</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Offers</span><span className="small fw-semibold text-teal">{property.seasonalOffer ? `${property.seasonalOffer.name} (${property.seasonalOffer.percent}% off)` : "Standard"}</span></div>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div>
            <h6 className="fw-bold text-navy mb-3">Property Amenities</h6>
            <div className="row g-2">
              {property.amenities && property.amenities.map(function(a) {
                if (!a.available) return null;
                return (
                  <div className="col-6 col-md-4" key={a.name}>
                    <div className={`p-2 border rounded small d-flex align-items-center justify-content-between ${a.underRepair ? "bg-light text-muted" : "bg-white"}`}>
                      <span className={a.underRepair ? "text-decoration-line-through text-muted" : "fw-medium"}>{a.name}</span>
                      {a.underRepair ? <span className="badge bg-warning text-dark" style={{ fontSize: "0.7rem" }}>Under repair</span> : <span className="badge bg-success-subtle text-success" style={{ fontSize: "0.7rem" }}>Available</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h6 className="fw-bold text-navy mb-3">Guest &amp; Critic Reviews</h6>
            {reviews.length === 0 ? (
              <div className="alert alert-light border text-muted small p-3 text-center">No reviews yet for this venue.</div>
            ) : (
              <div>
                <span className="small fw-bold text-teal d-block mb-2">Latest Reviews</span>
                <div className="d-flex flex-column gap-3 mb-4">
                  {latestTwo.map(function(r) {
                    return (
                      <div key={r.id} className="border rounded p-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold small">{r.userName || r.userEmail}</span>
                            {r.isCritic && <span className="badge bg-teal" style={{ fontSize: "0.7rem" }}>Verified Critic</span>}
                            <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "0.68rem" }}>Latest</span>
                          </div>
                          <span className="text-muted small">{r.date || "Recent"}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <StarRating rating={r.rating} />
                          <span className="small fw-bold text-navy">{r.rating} / 5</span>
                        </div>
                        <p className="fw-semibold small text-navy mb-1">{r.title}</p>
                        <p className="text-secondary small mb-2">{r.comment}</p>
                        {r.criteria && (
                          <div className="d-flex flex-wrap gap-1">
                            {Object.keys(r.criteria).filter(function(k) { return r.criteria[k] > 0; }).map(function(k) {
                              return <span key={k} className="badge bg-white text-dark border" style={{ fontSize: "0.68rem" }}><span className="text-capitalize">{k}</span>: ★{r.criteria[k]}</span>;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "availability" && (
          <div>
            <h6 className="fw-bold text-navy mb-3">Operating &amp; Stay Policy</h6>
            <ul className="list-unstyled small text-secondary mb-0">
              <li className="mb-2">&bull; Hours: {property.openTime || "07:00 AM"} &ndash; {property.closeTime || "11:00 PM"}</li>
              <li className="mb-2">&bull; Min Stay: {property.minStay || 1} Night(s)</li>
              <li className="mb-2">&bull; Status: <strong className="text-capitalize text-teal">{property.status}</strong></li>
            </ul>
          </div>
        )}

        {activeTab === "faqs" && <FaqAccordion faqs={property.faqs} />}
      </div>
    </div>
  );
}
