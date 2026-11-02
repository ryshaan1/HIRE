import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import MyProperty from "../manager/MyProperty.jsx";
import ManagerBookings from "../manager/ManagerBookings.jsx";
import ManagerDiscounts from "../manager/ManagerDiscounts.jsx";
import ManagerReports from "../manager/ManagerReports.jsx";
import VenueRulesEditor from "../manager/VenueRulesEditor.jsx";
import StarRating from "../common/StarRating.jsx";

export default function ManagerDashboard() {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("property");
  const [properties, setProperties] = useState(function() {
    return getShared("hire_properties", initialProperties);
  });
  const [bookings, setBookings] = useState(function() {
    return getShared("hire_bookings", []);
  });
  const [reviews, setReviews] = useState(function() {
    return getShared("hire_reviews", []);
  });
  const [unflagNote, setUnflagNote] = useState("");
  const [unflagSentMsg, setUnflagSentMsg] = useState("");

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const freshProps = getShared("hire_properties", initialProperties);
      const freshBooks = getShared("hire_bookings", []);
      const freshRevs = getShared("hire_reviews", []);
      setProperties(freshProps);
      setBookings(freshBooks);
      setReviews(freshRevs);
    });

    return unsubscribe;
  }, []);

  const managerProperty = properties.find(function(p) {
    if (currentUser && currentUser.propertyId) {
      return String(p.id) === String(currentUser.propertyId);
    }
    if (currentUser && currentUser.email) {
      return p.managerEmail === currentUser.email;
    }
    return false;
  }) || properties[0];

  function handleSaveProperty(updatedProp) {
    const currentList = getShared("hire_properties", properties);
    const nextList = currentList.map(function(p) {
      if (String(p.id) === String(updatedProp.id)) {
        return { ...p, ...updatedProp };
      }
      return p;
    });
    setProperties(nextList);
    setShared("hire_properties", nextList);
    broadcastAction("PROPERTY_UPDATED", updatedProp);
  }

  function handleSaveRules(updatedRules) {
    if (!managerProperty) return;
    const updatedProp = { ...managerProperty, rules: updatedRules };
    handleSaveProperty(updatedProp);
  }

  function handleRequestUnflag(e) {
    e.preventDefault();
    if (!managerProperty) return;
    const note = unflagNote.trim();
    if (!note) return;

    const currentList = getShared("hire_properties", properties);
    const nextList = currentList.map(function(p) {
      if (String(p.id) === String(managerProperty.id)) {
        return {
          ...p,
          unflagRequested: true,
          unflagNotes: note
        };
      }
      return p;
    });
    setProperties(nextList);
    setShared("hire_properties", nextList);
    broadcastAction("PROPERTY_UNFLAG_REQUESTED", { id: managerProperty.id, note: note });
    setUnflagSentMsg("Unflag request submitted to admin successfully.");
    setUnflagNote("");
    setTimeout(function() { setUnflagSentMsg(""); }, 4000);
  }

  function handleUpdateBookingStatus(bookingId, newStatus, proposalNote = "") {
    const nextBookings = bookings.map(function(b) {
      if (b.id === bookingId) {
        return {
          ...b,
          status: newStatus,
          rescheduleProposal: proposalNote || b.rescheduleProposal || "",
          refundNote: newStatus.includes("Refund") ? (proposalNote || "100% refund processed") : b.refundNote
        };
      }
      return b;
    });
    setBookings(nextBookings);
    setShared("hire_bookings", nextBookings);
    broadcastAction("BOOKING_STATUS_CHANGED", { bookingId, newStatus });
  }

  const propertyBookings = bookings.filter(function(b) {
    return managerProperty && String(b.propertyId) === String(managerProperty.id);
  });

  const propertyReviews = reviews.filter(function(r) {
    return managerProperty && String(r.propertyId) === String(managerProperty.id);
  });

  if (!managerProperty) {
    return <div className="p-4 text-center">Loading property profile...</div>;
  }

  const isFlagged = managerProperty.status === "flagged";
  const isBanned = managerProperty.status === "banned";

  return (
    <div className="hire-manager py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-0">Manager Dashboard</h4>
          <span className="small text-muted">{managerProperty.name} &bull; {managerProperty.city}, {managerProperty.country}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${
            isBanned ? "bg-danger" : isFlagged ? "bg-warning text-dark" : "bg-teal"
          }`}>
            {isBanned ? "Banned Venue" : isFlagged ? "Flagged Venue" : (currentUser && currentUser.name)}
          </span>
        </div>
      </div>

      {isFlagged && (
        <div className="card border-warning bg-warning bg-opacity-10 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex align-items-start gap-2">
              <span className="fs-4">⚠️</span>
              <div className="flex-grow-1">
                <h6 className="fw-bold text-dark mb-1">
                  Warning: Your venue has been FLAGGED by Admin
                </h6>
                <div className="mb-2">
                  <span className="small fw-semibold text-danger d-block mb-1">Reasons Flagged:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {(managerProperty.flagReason || "Compliance Flag").split(", ").map(function(r, idx) {
                      return <span key={idx} className="badge bg-danger text-white">{r}</span>;
                    })}
                  </div>
                  {managerProperty.flagNotes && (
                    <div className="small text-muted mt-2">
                      <strong>Admin Directive:</strong> {managerProperty.flagNotes}
                    </div>
                  )}
                </div>
                <p className="small text-muted mb-2">
                  Your listing is flagged due to the reasons above. Please rectify your pricing, amenities, or hygiene issues. Once resolved, submit an unflag notification to Admin for review.
                </p>

                {managerProperty.unflagRequested ? (
                  <div className="alert alert-info py-2 px-3 small mb-0 d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Unflag Request Submitted:</strong>
                      <span className="ms-1">Admin has been notified with your note: <em>"{managerProperty.unflagNotes}"</em>. Verification pending.</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRequestUnflag} className="mt-2">
                    <div className="row g-2 align-items-center">
                      <div className="col-12 col-md-8">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Describe what was fixed (e.g. Adjusted pricing, repaired amenities)..."
                          value={unflagNote}
                          onChange={function(e) { setUnflagNote(e.target.value); }}
                          required
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <button type="submit" className="btn btn-sm btn-teal w-100">
                          Submit Unflag Notification
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {unflagSentMsg && <div className="alert alert-success py-1 px-2 small mt-2 mb-0">{unflagSentMsg}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {isBanned && (
        <div className="card border-danger bg-danger bg-opacity-10 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex align-items-start gap-2">
              <span className="fs-4">🚫</span>
              <div>
                <h6 className="fw-bold text-danger mb-1">
                  Notice: Your venue has been BANNED by Admin
                </h6>
                <div className="mb-2">
                  <span className="small fw-semibold text-danger d-block mb-1">Ban Violations:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {(managerProperty.banReason || "Terms of Service Violation").split(", ").map(function(r, idx) {
                      return <span key={idx} className="badge bg-danger text-white">{r}</span>;
                    })}
                  </div>
                  {managerProperty.banNotes && (
                    <div className="small text-danger-emphasis mt-2">
                      <strong>Audit Details:</strong> {managerProperty.banNotes}
                    </div>
                  )}
                </div>
                <p className="small text-danger-emphasis mb-0">
                  This venue is permanently restricted from accepting bookings or receiving public feature status.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <div className="list-group shadow-sm border rounded">
            {[
              { id: "property", label: "My Property" },
              { id: "bookings", label: `Bookings (${propertyBookings.length})` },
              { id: "rules", label: "Rules & Policies" },
              { id: "critics", label: `Critic Reviews (${propertyReviews.length})` },
              { id: "discounts", label: "Discounts & Offers" },
              { id: "reports", label: "Reports & Analytics" }
            ].map(function(tab) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`list-group-item list-group-item-action small fw-semibold border-0 ${
                    activeTab === tab.id ? "active bg-teal" : "text-secondary"
                  }`}
                  onClick={function() { setActiveTab(tab.id); }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-12 col-md-9">
          {activeTab === "property" && (
            <MyProperty
              property={managerProperty}
              onSave={handleSaveProperty}
            />
          )}

          {activeTab === "bookings" && (
            <ManagerBookings
              bookings={propertyBookings}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          )}

          {activeTab === "rules" && (
            <VenueRulesEditor
              property={managerProperty}
              onSaveRules={handleSaveRules}
            />
          )}

          {activeTab === "critics" && (
            <div className="card shadow-sm border rounded bg-white p-4">
              <h5 className="fw-bold text-navy mb-3">Verified Critic Reviews &amp; Scorecards</h5>
              {propertyReviews.length === 0 ? (
                <div className="text-muted text-center py-4 small">
                  No professional critic reviews submitted for this property yet.
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {propertyReviews.map(function(rev) {
                    return (
                      <div key={rev.id} className="border rounded p-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-navy">{rev.title}</strong>
                          <div className="d-flex align-items-center gap-1">
                            <StarRating rating={rev.rating} />
                            <span className="small fw-bold text-dark">{rev.rating}</span>
                          </div>
                        </div>
                        <div className="small text-muted mb-2">
                          By <strong>{rev.userName}</strong> &bull; {rev.date}
                        </div>
                        <p className="small text-secondary mb-2">{rev.comment}</p>
                        {rev.criteria && (
                          <div className="d-flex flex-wrap gap-2 pt-2 border-top small">
                            {Object.entries(rev.criteria).map(function([crit, val]) {
                              return (
                                <span key={crit} className="badge bg-white text-dark border">
                                  {crit}: {val}/5
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "discounts" && (
            <ManagerDiscounts
              property={managerProperty}
              onSave={handleSaveProperty}
            />
          )}

          {activeTab === "reports" && (
            <ManagerReports
              property={managerProperty}
            />
          )}
        </div>
      </div>
    </div>
  );
}
