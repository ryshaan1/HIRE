import { useState, useEffect, useContext } from "react";
import StarRating from "./StarRating.jsx";
import FaqAccordion from "./FaqAccordion.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { fetchHotelReviews, createReview } from "../../services/api.js";

export default function PropertyTabs({ property, reviews = [] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser } = useContext(AuthContext);

  const [dbReviews, setDbReviews] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  async function loadReviews() {
    try {
      const res = await fetchHotelReviews(String(property.id));
      if (res && res.success) {
        setDbReviews(res.latestReviews || []);
        setOverallScore(res.overallScore || 0);
        setTotalCount(res.totalReviews || 0);
      }
    } catch (e) {}
  }

  useEffect(() => {
    loadReviews();
  }, [property.id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setSubmitMsg("");

    try {
      await createReview({
        hotelId: String(property.id),
        hotelName: property.name,
        userName: currentUser ? currentUser.name : "Guest Reviewer",
        rating: Number(newRating),
        comment: newTitle ? `${newTitle} - ${newComment}` : newComment,
        status: "Approved"
      });
      setNewTitle("");
      setNewComment("");
      setSubmitMsg("Thank you! Your review has been saved to the database.");
      await loadReviews();
    } catch (err) {
      setSubmitMsg("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayedReviews = dbReviews.length > 0 ? dbReviews : reviews.slice(0, 3);
  const displayedScore = overallScore > 0 ? overallScore : (property.rating > 0 ? property.rating : "0");
  const displayedCount = totalCount > 0 ? totalCount : reviews.length;

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
                  {t} {t === "reviews" && `(${displayedCount})`}
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
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Overall Score</span><span className="small fw-semibold text-teal">★ {displayedScore} ({displayedCount} reviews)</span></div>
              <div className="col-6 col-md-4"><span className="text-muted small d-block">Status</span><span className="small fw-semibold text-teal">{property.status}</span></div>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-navy mb-0">Guest &amp; Critic Reviews</h6>
              <div className="badge bg-teal p-2">
                Overall Average: ★ {displayedScore} / 5
              </div>
            </div>

            {displayedReviews.length === 0 ? (
              <div className="alert alert-light border text-muted small p-3 text-center mb-4">No reviews yet for this venue. Be the first to leave one below!</div>
            ) : (
              <div>
                <span className="small fw-bold text-teal d-block mb-2">Latest 3 Reviews (From MongoDB)</span>
                <div className="d-flex flex-column gap-3 mb-4">
                  {displayedReviews.map(function(r, idx) {
                    return (
                      <div key={r._id || r.id || idx} className="border rounded p-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold small">{r.userName || r.userEmail}</span>
                            <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "0.68rem" }}>Verified</span>
                          </div>
                          <span className="text-muted small">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : (r.date || "Recent")}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <StarRating rating={r.rating} />
                          <span className="small fw-bold text-navy">{r.rating} / 5</span>
                        </div>
                        <p className="text-secondary small mb-0">{r.comment}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card border p-3 bg-light">
              <h6 className="fw-bold text-navy mb-2">Leave a Review</h6>
              {submitMsg && <div className="alert alert-success py-2 small mb-2">{submitMsg}</div>}
              <form onSubmit={handleSubmitReview}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Rating (1 to 5 Stars)</label>
                  <select className="form-select form-select-sm" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Review Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Brief headline of your experience"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Your Review Details</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder="Share details about the service, amenities, ambiance, etc."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-sm btn-teal px-3" disabled={submitting}>
                  {submitting ? "Saving to Database..." : "Submit Review"}
                </button>
              </form>
            </div>
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
