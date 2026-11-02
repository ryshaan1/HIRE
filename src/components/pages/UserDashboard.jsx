import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import CriticReviewModal from "../critic/CriticReviewModal.jsx";

export default function UserDashboard() {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState(function() {
    return getShared("hire_bookings", []);
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [reviewProperty, setReviewProperty] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      setBookings(getShared("hire_bookings", []));
    });
    return unsubscribe;
  }, []);

  if (!currentUser) {
    return (
      <div className="card shadow-sm border p-5 text-center my-4 bg-white" style={{ maxWidth: "540px", margin: "0 auto" }}>
        <h5 className="fw-bold text-navy mb-2">Login Required</h5>
        <p className="text-muted small mb-3">Please sign in to access your user reservation dashboard and stay history.</p>
        <Link to="/login" className="btn btn-teal btn-sm mx-auto d-inline-block px-4">Sign in</Link>
      </div>
    );
  }

  const myBookings = bookings.filter(function(b) {
    return b.userEmail === currentUser.email;
  });

  const activeBookings = myBookings.filter(function(b) {
    return b.status === "Pending Approval" || b.status === "Confirmed" || b.status === "Reschedule Requested" || b.status === "Pending";
  });

  const historyBookings = myBookings.filter(function(b) {
    return b.status === "Completed" || b.status === "Cancelled" || b.status === "Cancelled by Manager" || b.status === "Rejected" || b.status === "Refunded (100% Cash/Card)";
  });

  function handleCancelBooking(bookingId) {
    const next = bookings.map(function(b) {
      if (b.id === bookingId) {
        return {
          ...b,
          status: "Cancelled",
          refundNote: "100% deposit eligible for refund per cancellation terms"
        };
      }
      return b;
    });
    setBookings(next);
    setShared("hire_bookings", next);
    broadcastAction("BOOKING_STATUS_CHANGED", { bookingId, newStatus: "Cancelled" });
    setActionMsg("Booking cancelled. Refund request logged per venue policy.");
    setTimeout(function() { setActionMsg(""); }, 4000);
  }

  function handleAcceptReschedule(bookingId) {
    const next = bookings.map(function(b) {
      if (b.id === bookingId) {
        return {
          ...b,
          status: "Confirmed",
          managerDirectives: "Reschedule accepted by guest."
        };
      }
      return b;
    });
    setBookings(next);
    setShared("hire_bookings", next);
    broadcastAction("BOOKING_STATUS_CHANGED", { bookingId, newStatus: "Confirmed" });
    setActionMsg("Rescheduled stay accepted and confirmed!");
    setTimeout(function() { setActionMsg(""); }, 4000);
  }

  function handleSaveReview(reviewData) {
    if (!reviewProperty) return;
    const currentReviews = getShared("hire_reviews", []);
    const newRev = {
      id: Date.now(),
      propertyId: reviewProperty.id,
      propertyName: reviewProperty.name,
      userName: currentUser.name || "Critic",
      userEmail: currentUser.email,
      isCritic: Boolean(currentUser.role === "critic"),
      rating: reviewData.rating,
      criteria: reviewData.criteria,
      title: reviewData.title,
      comment: reviewData.comment,
      date: new Date().toISOString().split("T")[0]
    };
    const nextReviews = [newRev, ...currentReviews];
    setShared("hire_reviews", nextReviews);
    broadcastAction("REVIEW_ADDED", newRev);
    setReviewProperty(null);
    setActionMsg("Official review scorecard published successfully!");
    setTimeout(function() { setActionMsg(""); }, 4000);
  }

  return (
    <div className="hire-user-dashboard py-3">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-0">My Bookings &amp; Stay History</h4>
          <span className="small text-muted">
            Logged in as <strong>{currentUser.name || currentUser.email}</strong> &bull; {currentUser.role === "critic" ? "Verified Hospitality Critic" : "Guest Account"}
          </span>
        </div>
        <Link to="/search" className="btn btn-sm btn-teal shadow-sm">
          + Book Another Venue
        </Link>
      </div>

      {actionMsg && <div className="alert alert-success py-2 px-3 small text-center mb-3">{actionMsg}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border rounded bg-white p-3">
            <span className="small text-muted d-block">Active / Upcoming Reservations</span>
            <span className="fs-3 fw-bold text-navy">{activeBookings.length}</span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border rounded bg-white p-3">
            <span className="small text-muted d-block">Completed &amp; Past Stays</span>
            <span className="fs-3 fw-bold text-teal">{historyBookings.length}</span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border rounded bg-white p-3">
            <span className="small text-muted d-block">Total Reservations Ledger</span>
            <span className="fs-3 fw-bold text-secondary">{myBookings.length}</span>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 border-bottom mb-4">
        <button
          type="button"
          className={`btn btn-sm fw-semibold border-0 rounded-0 pb-2 ${activeTab === "active" ? "border-bottom border-3 border-teal text-teal" : "text-secondary"}`}
          onClick={function() { setActiveTab("active"); }}
        >
          Active Reservations ({activeBookings.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm fw-semibold border-0 rounded-0 pb-2 ${activeTab === "history" ? "border-bottom border-3 border-teal text-teal" : "text-secondary"}`}
          onClick={function() { setActiveTab("history"); }}
        >
          Stay History &amp; Dining Ledger ({historyBookings.length})
        </button>
      </div>

      {activeTab === "active" && (
        <div>
          {activeBookings.length === 0 ? (
            <div className="card shadow-sm border p-5 text-center text-muted rounded bg-white">
              <p className="mb-2">No active reservations at the moment.</p>
              <Link to="/search" className="btn btn-sm btn-outline-teal d-inline-block mx-auto">Explore Venues</Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {activeBookings.map(function(b) {
                const isPending = b.status === "Pending Approval" || b.status === "Pending";
                const isReschedule = b.status === "Reschedule Requested";
                const isConfirmed = b.status === "Confirmed" || b.status === "Accepted";

                return (
                  <div key={b.id} className="card shadow-sm border rounded bg-white p-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold text-navy mb-0">{b.propertyName}</h6>
                          <span className={`badge ${
                            isConfirmed ? "bg-success" : isReschedule ? "bg-warning text-dark" : "bg-warning text-dark"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <span className="small text-muted">{b.propertyCity}, {b.propertyCountry} &bull; Ref #{String(b.id).slice(-8)}</span>
                      </div>
                      <div className="text-md-end">
                        <span className="fs-6 fw-bold text-teal">{b.currencySymbol || "$"} {(b.localTotal || b.total).toLocaleString()}</span>
                        <div className="small text-muted">(~${b.usdTotal || b.total} USD)</div>
                      </div>
                    </div>

                    <div className="row g-2 small text-secondary bg-light p-2 rounded mb-3">
                      <div className="col-6 col-md-3"><strong>Check-In:</strong> {b.checkIn}</div>
                      <div className="col-6 col-md-3"><strong>Check-Out:</strong> {b.checkOut}</div>
                      <div className="col-6 col-md-3"><strong>Guests:</strong> {b.guests} ({b.unitCount} {b.rateUnit || "units"})</div>
                      <div className="col-6 col-md-3"><strong>Advance Paid:</strong> {b.currencySymbol || "$"} {(b.advancePaid || Math.round(b.total * 0.5)).toLocaleString()}</div>
                    </div>

                    {isReschedule && (
                      <div className="alert alert-warning py-2 px-3 small mb-3">
                        <strong>Manager Reschedule Request:</strong> {b.rescheduleProposal || "Venue requested to adjust your reservation window."}
                        <div className="mt-2 d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-success py-0 px-2"
                            onClick={function() { handleAcceptReschedule(b.id); }}
                          >
                            Accept Reschedule
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-0 px-2"
                            onClick={function() { handleCancelBooking(b.id); }}
                          >
                            Decline &amp; Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={function() { setSelectedReceipt(b); }}
                      >
                        View Commercial Receipt
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={function() { handleCancelBooking(b.id); }}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {historyBookings.length === 0 ? (
            <div className="card shadow-sm border p-5 text-center text-muted rounded bg-white">
              No historical or cancelled reservations recorded.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {historyBookings.map(function(b) {
                return (
                  <div key={b.id} className="card shadow-sm border rounded bg-white p-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold text-navy mb-0">{b.propertyName}</h6>
                          <span className={`badge ${
                            b.status === "Completed" ? "bg-primary" : "bg-danger"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <span className="small text-muted">{b.propertyCity}, {b.propertyCountry} &bull; Stay: {b.checkIn} to {b.checkOut}</span>
                      </div>
                      <div className="text-md-end">
                        <span className="small fw-bold text-secondary">{b.currencySymbol || "$"} {(b.localTotal || b.total).toLocaleString()}</span>
                        {b.refundNote && <div className="small text-success">{b.refundNote}</div>}
                      </div>
                    </div>

                    <div className="small text-muted mb-2">
                      <strong>Dining / Service Ledger:</strong> {b.foodEaten || "Continental Service"}
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={function() { setSelectedReceipt(b); }}
                      >
                        Receipt
                      </button>
                      {(currentUser.role === "critic" || currentUser.role === "customer") && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-teal"
                          onClick={function() { setReviewProperty({ id: b.propertyId, name: b.propertyName }); }}
                        >
                          Submit Critic / Guest Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedReceipt && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header py-2 bg-light">
                <h6 className="modal-title fw-bold text-navy">Itemized Commercial Receipt</h6>
                <button type="button" className="btn-close" onClick={function() { setSelectedReceipt(null); }}></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-3">
                  <h5 className="fw-bold text-navy mb-0">{selectedReceipt.propertyName}</h5>
                  <span className="small text-muted">{selectedReceipt.propertyCity}, {selectedReceipt.propertyCountry}</span>
                  <div className="small text-muted mt-1">Receipt Reference #{String(selectedReceipt.id).slice(-8)}</div>
                </div>

                <div className="border rounded p-3 mb-3 small bg-light">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Guest:</span>
                    <strong>{selectedReceipt.userName}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Stay Duration:</span>
                    <span>{selectedReceipt.checkIn} to {selectedReceipt.checkOut}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Headcount / Units:</span>
                    <span>{selectedReceipt.guests} Guests ({selectedReceipt.unitCount} {selectedReceipt.rateUnit || "units"})</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Status:</span>
                    <span className="badge bg-teal">{selectedReceipt.status}</span>
                  </div>
                </div>

                <div className="small border-top pt-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Settlement Currency:</span>
                    <span>{selectedReceipt.currencyCode || "USD"} ({selectedReceipt.currencySymbol || "$"})</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Total Amount:</span>
                    <strong>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.localTotal || selectedReceipt.total).toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-muted">
                    <span>USD Equivalent:</span>
                    <span>~${selectedReceipt.usdTotal || selectedReceipt.total} USD</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Advance Deposit Paid:</span>
                    <span>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.advancePaid || Math.round(selectedReceipt.total * 0.5)).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-secondary">
                    <span>Balance Due at Check-in:</span>
                    <span>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.balanceDue || Math.round(selectedReceipt.total * 0.5)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer py-2 bg-light">
                <button type="button" className="btn btn-sm btn-secondary" onClick={function() { setSelectedReceipt(null); }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewProperty && (
        <CriticReviewModal
          property={reviewProperty}
          onClose={function() { setReviewProperty(null); }}
          onPublish={handleSaveReview}
        />
      )}
    </div>
  );
}
