import { useState } from "react";
import StarRating from "../common/StarRating.jsx";

export default function CriticReviewModal({ property, onSubmit, onClose }) {
  const [criteria, setCriteria] = useState({
    cost: 0,
    location: 0,
    offers: 0,
    food: 0,
    hygiene: 0,
    services: 0,
    amenities: 0
  });
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const labels = [
    { key: "cost", label: "Cost (Budget)" },
    { key: "location", label: "Location & Access" },
    { key: "offers", label: "Offers & Value" },
    { key: "food", label: "Food & Cuisine" },
    { key: "hygiene", label: "Hygiene & Cleanliness" },
    { key: "services", label: "Guest Services" },
    { key: "amenities", label: "Amenities & Comfort" }
  ];

  function handleStarChange(key, stars) {
    setCriteria(function(prev) {
      return { ...prev, [key]: prev[key] === stars ? 0 : stars };
    });
  }

  const ratedKeys = Object.keys(criteria).filter(function(k) { return criteria[k] > 0; });
  const totalStars = ratedKeys.reduce(function(acc, k) { return acc + criteria[k]; }, 0);
  const calculatedAvg = ratedKeys.length > 0 ? Number((totalStars / ratedKeys.length).toFixed(1)) : 5.0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      setErrorMsg("Please provide both a headline title and detailed critique.");
      return;
    }
    setErrorMsg("");
    onSubmit({
      rating: calculatedAvg,
      criteria: criteria,
      title: title.trim(),
      comment: comment.trim()
    });
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <div>
              <h6 className="modal-title fw-bold text-navy mb-0">Critic Review: {property.name}</h6>
              <span className="small text-muted">{property.type} &bull; {property.city}</span>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: "72vh", overflowY: "auto" }}>
              {errorMsg && <div className="alert alert-danger py-1 px-2 small mb-3">{errorMsg}</div>}

              <div className="p-3 bg-light rounded border mb-3 text-center">
                <span className="small text-muted d-block">Critic Calculated Score Formula</span>
                <span className="fs-3 fw-bold text-teal">{calculatedAvg} / 5.0</span>
                <span className="small text-secondary d-block">
                  {ratedKeys.length > 0 ? `Calculated across ${ratedKeys.length} selected criteria` : "No criteria selected yet (optional)"}
                </span>
              </div>

              <div className="row g-2 mb-3">
                {labels.map(function(item) {
                  return (
                    <div className="col-12 col-sm-6" key={item.key}>
                      <div className="border rounded p-2 d-flex justify-content-between align-items-center bg-white">
                        <span className="small fw-semibold">{item.label}</span>
                        <StarRating
                          rating={criteria[item.key]}
                          interactive={true}
                          onChange={function(stars) { handleStarChange(item.key, stars); }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Review Headline</label>
                <input type="text" className="form-control form-control-sm" placeholder="e.g. Masterclass in Coastal Flavour" value={title} onChange={function(e) { setTitle(e.target.value); }} required />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Detailed Critic Critique</label>
                <textarea className="form-control form-control-sm" rows="3" placeholder="Share your professional review..." value={comment} onChange={function(e) { setComment(e.target.value); }} required></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-sm btn-teal px-4">Publish Critic Rating</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
