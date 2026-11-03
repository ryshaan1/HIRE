import { useState } from "react";

export default function ManagerBookings({ bookings = [], onUpdateStatus }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState(null);
  const [proposedCheckIn, setProposedCheckIn] = useState("");
  const [proposedCheckOut, setProposedCheckOut] = useState("");
  const [proposedRoomType, setProposedRoomType] = useState("Deluxe Suite");
  const [rescheduleMessage, setRescheduleMessage] = useState(
    "Sorry, we don't have any slots or are busy right now, so can you kindly consider our nearby date or please reschedule, or kindly choose another type of room for your stay."
  );

  if (bookings.length === 0) {
    return (
      <div className="card shadow-sm border p-4 text-center text-muted rounded bg-white">
        No guest booking requests received yet.
      </div>
    );
  }

  function openRescheduleModal(booking) {
    setRescheduleModalBooking(booking);
    setProposedCheckIn(booking.checkIn);
    setProposedCheckOut(booking.checkOut);
    setProposedRoomType(booking.roomType || "Deluxe Suite");
    setRescheduleMessage(
      "Sorry, we don't have any slots or are busy right now, so can you kindly consider our nearby date or please reschedule, or kindly choose another type of room for your stay."
    );
  }

  function handleSendReschedule() {
    if (!rescheduleModalBooking) return;
    const proposal = {
      message: rescheduleMessage.trim(),
      newCheckIn: proposedCheckIn || rescheduleModalBooking.checkIn,
      newCheckOut: proposedCheckOut || rescheduleModalBooking.checkOut,
      newRoomType: proposedRoomType || rescheduleModalBooking.roomType,
      requestedAt: new Date().toISOString()
    };
    onUpdateStatus(rescheduleModalBooking.id, "Reschedule Requested", proposal);
    setRescheduleModalBooking(null);
  }

  function handleProcessCancellationRefund(booking) {
    const refundNote = `Refund processed per venue policy: ${booking.currencySymbol || "$"}${(booking.advancePaid || 0).toLocaleString()} credited back to ${booking.cardBrand || "original card"} ending in ••••${booking.cardLast4 || "4242"}.`;
    onUpdateStatus(booking.id, "Refunded (100% Cash/Card)", refundNote);
  }

  return (
    <div className="card shadow-sm border rounded bg-white p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-navy mb-0">Booking Requests &amp; Guest Ledger</h6>
        <span className="small text-muted">{bookings.length} reservations</span>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr className="text-muted small">
              <th>Ref #</th>
              <th>Guest &amp; Pre-order</th>
              <th>Stay Dates</th>
              <th>Room Category</th>
              <th>Financials &amp; Deposit</th>
              <th>Status</th>
              <th className="text-end">Manager Directives</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(function(b) {
              const isPaymentReceived = b.status === "Payment Received";
              const isConfirmed = b.status === "Confirmed" || b.status === "Accepted";
              const isReschedule = b.status === "Reschedule Requested";
              const isCancelled = b.status === "Cancelled" || b.status === "Cancelled by Manager" || b.status === "Rejected";
              const isRefunded = b.status === "Refunded (100% Cash/Card)" || b.status === "Refunded";

              return (
                <tr key={b.id}>
                  <td className="small fw-semibold">#{String(b.id).slice(-6)}</td>
                  <td className="small">
                    <strong>{b.userName || b.userEmail}</strong>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Food: {b.foodPreorder || b.foodEaten || "As per mood"}
                    </div>
                  </td>
                  <td className="small">
                    <div>{b.checkIn} to {b.checkOut}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{b.guests} Guests</div>
                  </td>
                  <td className="small text-navy fw-semibold">
                    {b.roomType || "Standard"}
                  </td>
                  <td className="small">
                    <div className="fw-bold text-teal">
                      {b.currencySymbol || "$"} {(b.localTotal || b.total || 0).toLocaleString()}
                    </div>
                    <div className="text-success" style={{ fontSize: "0.75rem" }}>
                      Deposit Paid: {b.currencySymbol || "$"} {(b.advancePaid || 0).toLocaleString()}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Due at desk: {b.currencySymbol || "$"} {(b.balanceDue || 0).toLocaleString()} ({b.cardBrand || "Card"} ••••{b.cardLast4 || "4242"})
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        isConfirmed
                          ? "bg-success"
                          : isPaymentReceived
                          ? "bg-teal text-white"
                          : isReschedule
                          ? "bg-warning text-dark"
                          : isRefunded
                          ? "bg-info text-dark"
                          : isCancelled
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        onClick={function() { setSelectedReceipt(b); }}
                      >
                        Receipt
                      </button>

                      {(isPaymentReceived || b.status === "Pending Approval" || b.status === "Pending") && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm py-0 px-2"
                            onClick={function() { onUpdateStatus(b.id, "Confirmed", "Reservation confirmed and dates allocated."); }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-warning text-dark btn-sm py-0 px-2"
                            onClick={function() { openRescheduleModal(b); }}
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={function() { handleProcessCancellationRefund(b); }}
                          >
                            Cancel &amp; Refund
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-warning text-dark btn-sm py-0 px-2"
                            onClick={function() { openRescheduleModal(b); }}
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={function() { handleProcessCancellationRefund(b); }}
                          >
                            Refund Deposit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rescheduleModalBooking && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header py-2 bg-light">
                <h6 className="modal-title fw-bold text-navy">Propose Reschedule Window or Alternative Room</h6>
                <button type="button" className="btn-close" onClick={function() { setRescheduleModalBooking(null); }}></button>
              </div>
              <div className="modal-body p-3">
                <p className="small text-muted mb-3">
                  Inform the guest regarding venue availability and offer nearby alternative dates or room categories.
                </p>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-muted">Proposed Check-In</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={proposedCheckIn}
                      onChange={function(e) { setProposedCheckIn(e.target.value); }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-muted">Proposed Check-Out</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={proposedCheckOut}
                      onChange={function(e) { setProposedCheckOut(e.target.value); }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-muted">Alternative Room / Table Option</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={proposedRoomType}
                      onChange={function(e) { setProposedRoomType(e.target.value); }}
                      placeholder="e.g. Standard Classic Room, Garden Terrace Loft"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Manager Rescheduling Directive</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    value={rescheduleMessage}
                    onChange={function(e) { setRescheduleMessage(e.target.value); }}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={function() { setRescheduleModalBooking(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-teal"
                    onClick={handleSendReschedule}
                  >
                    Dispatch Reschedule Request
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <div><strong>Booking Ref:</strong> #{String(selectedReceipt.id).slice(-8)}</div>
                  <div><strong>Guest Name:</strong> {selectedReceipt.userName || selectedReceipt.userEmail}</div>
                  <div><strong>Stay Dates:</strong> {selectedReceipt.checkIn} to {selectedReceipt.checkOut}</div>
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
                    <span>Advance Deposit Paid:</span>
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
    </div>
  );
}
