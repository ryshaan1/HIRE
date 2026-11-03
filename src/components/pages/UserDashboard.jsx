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

  const todayStr = new Date().toISOString().split("T")[0];

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
    return (
      b.status === "Payment Received" ||
      b.status === "Pending Approval" ||
      b.status === "Confirmed" ||
      b.status === "Reschedule Requested" ||
      b.status === "Pending"
    );
  });

  const historyBookings = myBookings.filter(function(b) {
    return (
      b.status === "Completed" ||
      b.status === "Cancelled" ||
      b.status === "Cancelled by Manager" ||
      b.status === "Rejected" ||
      b.status === "Refunded (100% Cash/Card)" ||
      b.status === "Refunded"
    );
  });

  function handleCancelBooking(bookingId) {
    const next = bookings.map(function(b) {
      if (b.id === bookingId) {
        return {
          ...b,
          status: "Cancelled",
          refundNote: `100% Pre-booking deposit (${b.currencySymbol || "$"}${b.advancePaid || 0}) refund requested and logged per venue cancellation terms.`
        };
      }
      return b;
    });
    setBookings(next);
    setShared("hire_bookings", next);
    broadcastAction("BOOKING_STATUS_CHANGED", { bookingId, newStatus: "Cancelled" });
    setActionMsg("Booking cancelled. Pre-booking deposit refund request logged per venue policy.");
    setTimeout(function() { setActionMsg(""); }, 4000);
  }

  function handleAcceptReschedule(bookingId) {
    const next = bookings.map(function(b) {
      if (b.id === bookingId) {
        const prop = b.rescheduleProposal || {};
        return {
          ...b,
          status: "Confirmed",
          checkIn: prop.newCheckIn || b.checkIn,
          checkOut: prop.newCheckOut || b.checkOut,
          roomType: prop.newRoomType || b.roomType,
          managerDirectives: "Reschedule accepted and confirmed by guest."
        };
      }
      return b;
    });
    setBookings(next);
    setShared("hire_bookings", next);
    broadcastAction("BOOKING_STATUS_CHANGED", { bookingId, newStatus: "Confirmed" });
    setActionMsg("Rescheduled reservation dates and room category confirmed!");
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
                const isPaymentReceived = b.status === "Payment Received";
                const isReschedule = b.status === "Reschedule Requested";
                const isConfirmed = b.status === "Confirmed" || b.status === "Accepted";
                const isStayDone = todayStr >= b.checkOut;

                const rescheduleMsg =
                  b.rescheduleProposal && typeof b.rescheduleProposal === "object"
                    ? b.rescheduleProposal.message
                    : b.rescheduleProposal ||
                      "Sorry, we don't have any slots or are busy right now, so can you kindly consider our nearby date or please reschedule / kindly choose another type of room for your stay.";

                return (
                  <div key={b.id} className="card shadow-sm border rounded bg-white p-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold text-navy mb-0">{b.propertyName}</h6>
                          <span
                            className={`badge ${
                              isConfirmed
                                ? "bg-success"
                                : isPaymentReceived
                                ? "bg-teal text-white"
                                : isReschedule
                                ? "bg-warning text-dark"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <span className="small text-muted">{b.propertyCity}, {b.propertyCountry} &bull; Ref #{String(b.id).slice(-8)}</span>
                      </div>
                      <div className="text-md-end">
                        <span className="fs-6 fw-bold text-teal">{b.currencySymbol || "$"} {(b.localTotal || b.total || 0).toLocaleString()}</span>
                        <div className="small text-muted">(${b.usdTotal || b.total || 0} USD)</div>
                      </div>
                    </div>

                    <div className="row g-2 small text-secondary bg-light p-2 rounded mb-3">
                      <div className="col-6 col-md-3"><strong>Check-In:</strong> {b.checkIn}</div>
                      <div className="col-6 col-md-3"><strong>Check-Out:</strong> {b.checkOut}</div>
                      <div className="col-6 col-md-3"><strong>Room / Table:</strong> {b.roomType || "Standard"}</div>
                      <div className="col-6 col-md-3"><strong>Food Pre-order:</strong> {b.foodPreorder || b.foodEaten || "As per mood"}</div>
                      <div className="col-6 col-md-3"><strong>Deposit Paid:</strong> {b.currencySymbol || "$"} {(b.advancePaid || 0).toLocaleString()}</div>
                      <div className="col-6 col-md-3"><strong>Balance Due:</strong> {b.currencySymbol || "$"} {(b.balanceDue || 0).toLocaleString()}</div>
                      <div className="col-6 col-md-3"><strong>Instrument:</strong> {b.paymentMethod || "Card Deposit"}</div>
                      <div className="col-6 col-md-3"><strong>Guests:</strong> {b.guests} Guests</div>
                    </div>

                    {isReschedule && (
                      <div className="alert alert-warning py-3 px-3 small mb-3 border border-warning shadow-sm">
                        <div className="d-flex align-items-start gap-2 mb-2">
                          <span className="fs-5">⚠️</span>
                          <div className="flex-grow-1">
                            <strong className="d-block text-dark mb-1">Manager Reschedule Notification:</strong>
                            <p className="mb-2 text-secondary fst-italic">"{rescheduleMsg}"</p>
                            {b.rescheduleProposal && typeof b.rescheduleProposal === "object" && b.rescheduleProposal.newCheckIn && (
                              <div className="bg-white p-2 rounded border small">
                                <div><strong>Proposed Dates:</strong> {b.rescheduleProposal.newCheckIn} to {b.rescheduleProposal.newCheckOut}</div>
                                {b.rescheduleProposal.newRoomType && (
                                  <div><strong>Proposed Room / Option:</strong> {b.rescheduleProposal.newRoomType}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-success py-1 px-3 fw-semibold"
                            onClick={function() { handleAcceptReschedule(b.id); }}
                          >
                            Accept Reschedule
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-1 px-3"
                            onClick={function() { handleCancelBooking(b.id); }}
                          >
                            Decline &amp; Cancel (Full Refund)
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2 flex-wrap justify-content-end align-items-center">
                      {!isStayDone && (
                        <span className="small text-muted me-auto" style={{ fontSize: "0.75rem" }}>
                          Review unlocks after your stay completes on {b.checkOut}
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={function() { setSelectedReceipt(b); }}
                      >
                        View Commercial Receipt
                      </button>
                      {isStayDone ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-teal"
                          onClick={function() { setReviewProperty({ id: b.propertyId, name: b.propertyName }); }}
                        >
                          Submit Review / Feedback
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          disabled
                          title="Feedback can only be submitted after your stay is complete"
                        >
                          Feedback (Pending Stay)
                        </button>
                      )}
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
                const isStayDone = todayStr >= b.checkOut;

                return (
                  <div key={b.id} className="card shadow-sm border rounded bg-white p-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold text-navy mb-0">{b.propertyName}</h6>
                          <span
                            className={`badge ${
                              b.status === "Completed"
                                ? "bg-primary"
                                : b.status.includes("Refund")
                                ? "bg-info text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <span className="small text-muted">{b.propertyCity}, {b.propertyCountry} &bull; Stay: {b.checkIn} to {b.checkOut}</span>
                      </div>
                      <div className="text-md-end">
                        <span className="small fw-bold text-secondary">{b.currencySymbol || "$"} {(b.localTotal || b.total || 0).toLocaleString()}</span>
                        {b.refundNote && <div className="small text-success">{b.refundNote}</div>}
                      </div>
                    </div>

                    <div className="small text-muted mb-2">
                      <strong>Room:</strong> {b.roomType || "Standard"} &bull; <strong>Dining / Pre-order:</strong> {b.foodPreorder || b.foodEaten || "As per mood"}
                    </div>

                    <div className="d-flex gap-2 justify-content-end align-items-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={function() { setSelectedReceipt(b); }}
                      >
                        Receipt
                      </button>
                      {b.status !== "Cancelled" && b.status !== "Cancelled by Manager" && (
                        isStayDone ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-teal"
                            onClick={function() { setReviewProperty({ id: b.propertyId, name: b.propertyName }); }}
                          >
                            Submit Critic / Guest Review
                          </button>
                        ) : (
                          <span className="small text-muted">
                            Review unlocks on {b.checkOut}
                          </span>
                        )
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
                <h6 className="modal-title fw-bold text-navy">Commercial Reservation Receipt</h6>
                <button type="button" className="btn-close" onClick={function() { setSelectedReceipt(null); }}></button>
              </div>
              <div className="modal-body p-3">
                <div className="border rounded p-2 mb-3 bg-light small">
                  <div><strong>Reference:</strong> #{String(selectedReceipt.id).slice(-8)}</div>
                  <div><strong>Venue:</strong> {selectedReceipt.propertyName}</div>
                  <div><strong>Dates:</strong> {selectedReceipt.checkIn} to {selectedReceipt.checkOut}</div>
                  <div><strong>Room / Seating:</strong> {selectedReceipt.roomType || "Standard"}</div>
                  <div><strong>Food Pre-order:</strong> {selectedReceipt.foodPreorder || selectedReceipt.foodEaten || "As per mood"}</div>
                  <div><strong>Payment Mode:</strong> {selectedReceipt.paymentMethod || "Card Pre-booking"}</div>
                </div>

                <div className="card p-2 border mb-3 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Total Billable Amount:</span>
                    <strong className="text-teal">{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.localTotal || selectedReceipt.total || 0).toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between text-success mb-1">
                    <span>Pre-booking Advance Paid:</span>
                    <strong>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.advancePaid || 0).toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Balance Due at Check-in:</span>
                    <strong>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.balanceDue || 0).toLocaleString()}</strong>
                  </div>
                </div>

                {selectedReceipt.refundNote && (
                  <div className="alert alert-success py-1 px-2 small mb-3">
                    {selectedReceipt.refundNote}
                  </div>
                )}

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={function() { setSelectedReceipt(null); }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewProperty && (
        <CriticReviewModal
          property={reviewProperty}
          onClose={function() { setReviewProperty(null); }}
          onSubmit={handleSaveReview}
        />
      )}
    </div>
  );
}
