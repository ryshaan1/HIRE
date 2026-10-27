import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo } from "../../utils/pricing.js";
import CriticReviewModal from "../critic/CriticReviewModal.jsx";
import { createReview } from "../../services/api.js";

export default function CriticDashboard() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [properties, setProperties] = useState(function() {
    return getShared("hire_properties", initialProperties).filter(function(p) {
      return p.status !== "pending_admission";
    });
  });
  const [reviews, setReviews] = useState(function() {
    return getShared("hire_reviews", []);
  });
  const [licence, setLicence] = useState(currentUser ? currentUser.licenceNumber || "" : "");
  const [licenceMsg, setLicenceMsg] = useState("");
  const [activeProperty, setActiveProperty] = useState(null);

  // Real-time synchronization across localhost tabs
  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const allProps = getShared("hire_properties", initialProperties);
      setProperties(allProps.filter(function(p) { return p.status !== "pending_admission"; }));
      setReviews(getShared("hire_reviews", []));
    });

    return unsubscribe;
  }, []);

  function handleSaveLicence(e) {
    e.preventDefault();
    if (!currentUser) return;
    updateUser({ ...currentUser, licenceNumber: licence.trim() });
    broadcastAction("CRITIC_LICENCE_UPDATED", { email: currentUser.email, licence: licence.trim() });
    setLicenceMsg("Licence submitted for admin legal verification.");
    setTimeout(function() { setLicenceMsg(""); }, 3000);
  }

  const myReviews = reviews.filter(function(r) { return r.userEmail === (currentUser ? currentUser.email : ""); });
  const criticReviews = reviews.filter(function(r) { return r.isCritic; });
  const isApproved = currentUser && currentUser.isApproved;

  function handlePublishReview(data) {
    if (!activeProperty || !currentUser) return;
    const newRev = {
      id: Date.now(),
      propertyId: activeProperty.id,
      propertyName: activeProperty.name,
      userName: currentUser.name || "Critic",
      userEmail: currentUser.email,
      isCritic: true,
      rating: data.rating,
      criteria: data.criteria,
      title: data.title,
      comment: data.comment,
      date: new Date().toISOString().split("T")[0]
    };

    const nextReviews = [newRev, ...reviews];
    setShared("hire_reviews", nextReviews);
    setReviews(nextReviews);

    const propRevs = nextReviews.filter(function(r) { return r.propertyId === activeProperty.id; });
    const avg = Number((propRevs.reduce(function(acc, r) { return acc + Number(r.rating); }, 0) / propRevs.length).toFixed(1));
    const allProps = getShared("hire_properties", initialProperties);
    const updatedProps = allProps.map(function(p) {
      return p.id === activeProperty.id ? { ...p, rating: avg, reviewCount: propRevs.length } : p;
    });

    setShared("hire_properties", updatedProps);
    setProperties(updatedProps.filter(function(p) { return p.status !== "pending_admission"; }));
    createReview({
      hotelId: String(activeProperty.id),
      hotelName: activeProperty.name,
      userName: currentUser.name || "Critic",
      rating: Number(data.rating),
      comment: data.comment
    }).catch(function() {});
    broadcastAction("REVIEW_SUBMITTED", { propertyId: activeProperty.id, propertyName: activeProperty.name, rating: data.rating });
    setActiveProperty(null);
  }

  return (
    <div className="hire-critic py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-0">Critic Dashboard</h4>
          <span className="small text-muted">{currentUser && currentUser.name} &bull; Editorial Scorecards</span>
        </div>
        <span className={`badge p-2 ${isApproved ? "bg-success" : "bg-warning text-dark"}`}>
          {isApproved ? "✓ Verified & Legal Critic" : "⏳ Pending Legal Verification"}
        </span>
      </div>

      <div className="row g-2 mb-4">
        {[
          { label: "My Reviews", val: myReviews.length, clr: "text-teal" },
          { label: "All Critic Reviews", val: criticReviews.length, clr: "text-navy" },
          { label: "Properties Listed", val: properties.length, clr: "text-navy" },
          { label: "Licence Status", val: isApproved ? "Approved" : "Pending", clr: isApproved ? "text-success" : "text-warning" }
        ].map(function(item) {
          return (
            <div className="col-6 col-md-3" key={item.label}>
              <div className="card shadow-sm border rounded bg-white p-2 text-center">
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>{item.label}</span>
                <span className={`fs-5 fw-bold ${item.clr}`}>{item.val}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card shadow-sm border p-3 rounded bg-white mb-3">
        <h6 className="fw-bold text-navy mb-1">Critic Licence Credentials</h6>
        <form onSubmit={handleSaveLicence} className="row g-2 align-items-center">
          <div className="col-8 col-md-5">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. CRIT-9014"
              value={licence}
              onChange={function(e) { setLicence(e.target.value); }}
            />
          </div>
          <div className="col-4 col-md-2">
            <button type="submit" className="btn btn-sm btn-teal w-100">Update Licence</button>
          </div>
          {licenceMsg && <span className="small text-success">{licenceMsg}</span>}
        </form>
      </div>

      {!isApproved && (
        <div className="alert alert-warning py-2 px-3 small mb-3">
          Your critic licence is pending admin legal verification before you can publish ratings. Admin can approve it in the Admin console.
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border rounded bg-white p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold text-navy mb-0">Venues Available for Critic Audit &amp; Review</h6>
              <span className="small text-muted">{properties.length} venues</span>
            </div>
            <p className="small text-muted mb-2">
              Critics are authorized to inspect and review all active, flagged, and banned venues.
            </p>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th>Venue</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(function(prop) {
                    const reviewed = myReviews.some(function(r) { return r.propertyId === prop.id; });
                    const priceInfo = formatPriceInfo(prop);
                    return (
                      <tr key={prop.id}>
                        <td className="fw-semibold small">
                          <div className="d-flex align-items-center gap-2">
                            {prop.images && prop.images.length > 0 ? (
                              <img
                                src={prop.images[0]}
                                alt={prop.name}
                                className="rounded border object-fit-cover shadow-sm flex-shrink-0"
                                style={{ width: "48px", height: "36px" }}
                              />
                            ) : (
                              <div
                                className="rounded border bg-light text-muted d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "48px", height: "36px", fontSize: "0.62rem" }}
                              >
                                No Pic
                              </div>
                            )}
                            <div>
                              <div>{prop.name}</div>
                              <div className="text-muted fw-normal" style={{ fontSize: "0.72rem" }}>{prop.city}, {prop.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="small text-navy fw-semibold">
                          ${priceInfo.price} <span className="text-muted fw-normal" style={{ fontSize: "0.7rem" }}>{priceInfo.unitDisplay}</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            prop.status === "active" ? "bg-success" :
                            prop.status === "flagged" ? "bg-warning text-dark" : "bg-danger"
                          }`} style={{ fontSize: "0.7rem" }}>
                            {prop.status}
                          </span>
                          {prop.flagReason && (
                            <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                              {prop.flagReason}
                            </div>
                          )}
                          {prop.banReason && (
                            <div className="text-danger" style={{ fontSize: "0.68rem" }}>
                              {prop.banReason}
                            </div>
                          )}
                        </td>
                        <td className="small text-warning">★ {Number(prop.rating).toFixed(1)}</td>
                        <td className="text-end">
                          {reviewed ? (
                            <span className="badge bg-light text-secondary border">Reviewed</span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-teal py-0 px-2"
                              disabled={!isApproved}
                              onClick={function() { setActiveProperty(prop); }}
                              title={!isApproved ? "Licence approval required" : "Write critic review"}
                            >
                              Review
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border rounded bg-white p-3 h-100">
            <h6 className="fw-bold text-navy mb-2">Latest Critic Reviews Platform-wide</h6>
            {criticReviews.length === 0 ? <p className="text-muted small">No critic reviews yet.</p> : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "390px", overflowY: "auto" }}>
                {criticReviews.slice(0, 6).map(function(cr) {
                  return (
                    <div key={cr.id} className="border rounded p-2 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold small text-navy">{cr.propertyName || "Venue"}</span>
                        <span className="small text-warning">★ {cr.rating}</span>
                      </div>
                      <p className="small text-muted mb-1 text-truncate">{cr.title}</p>
                      <span className="text-secondary" style={{ fontSize: "0.7rem" }}>By {cr.userName} &bull; {cr.date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeProperty && (
        <CriticReviewModal
          property={activeProperty}
          onSubmit={handlePublishReview}
          onClose={function() { setActiveProperty(null); }}
        />
      )}
    </div>
  );
}
