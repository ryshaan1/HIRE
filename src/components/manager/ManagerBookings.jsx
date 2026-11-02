import { useState } from "react";

export default function ManagerBookings({ bookings = [], onUpdateStatus }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rescheduleModalId, setRescheduleModalId] = useState(null);
  const [rescheduleNote, setRescheduleNote] = useState("");

  if (bookings.length === 0) {
    return (
      <div className="card shadow-sm border p-4 text-center text-muted rounded bg-white">
        No guest booking requests received yet.
      </div>
    );
  }

  function handleSendReschedule(bookingId) {
    if (!rescheduleNote.trim()) return;
    onUpdateStatus(bookingId, "Reschedule Requested", rescheduleNote.trim());
    setRescheduleModalId(null);
    setRescheduleNote("");
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
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total &amp; Advance</th>
              <th>Status</th>
              <th className="text-end">Manager Directives</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(function(b) {
              const isPending = b.status === "Pending Approval" || b.status === "Pending";
              const isConfirmed = b.status === "Confirmed" || b.status === "Accepted";
              const isReschedule = b.status === "Reschedule Requested";
              const isCancelled = b.status === "Cancelled" || b.status === "Cancelled by Manager" || b.status === "Rejected";

              return (
                <tr key={b.id}>
                  <td className="small fw-semibold">#{String(b.id).slice(-6)}</td>
                  <td className="small">
                    <strong>{b.userName || b.userEmail}</strong>
                    {b.isCritic && <span className="d-block text-muted" style={{ fontSize: "0.75rem" }}>Verified Traveler</span>}
                  </td>
                  <td className="small">{b.checkIn}</td>
                  <td className="small">{b.checkOut}</td>
                  <td className="small">{b.guests}</td>
                  <td className="small">
                    <div className="fw-bold text-teal">
                      {b.currencySymbol || "$"} {(b.localTotal || b.total).toLocaleString()}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Adv: {b.currencySymbol || "$"} {(b.advancePaid || Math.round(b.total * 0.5)).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        isConfirmed
                          ? "bg-success"
                          : isReschedule
                          ? "bg-warning text-dark"
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

                      {isPending && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm py-0 px-2"
                            onClick={function() { onUpdateStatus(b.id, "Confirmed"); }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-warning text-dark btn-sm py-0 px-2"
                            onClick={function() { setRescheduleModalId(b.id); }}
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={function() { onUpdateStatus(b.id, "Cancelled by Manager", "Cancelled by venue management with full refund."); }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          onClick={function() { onUpdateStatus(b.id, "Refunded (100% Cash/Card)", "100% Cash/Card refund processed to guest."); }}
                        >
                          Issue Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rescheduleModalId && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header py-2 bg-light">
                <h6 className="modal-title fw-bold text-navy">Propose Reschedule Window to Guest</h6>
                <button type="button" className="btn-close" onClick={function() { setRescheduleModalId(null); }}></button>
              </div>
              <div className="modal-body p-3">
                <label className="form-label small text-muted">Proposed Dates / Reschedule Message</label>
                <textarea
                  className="form-control form-control-sm mb-3"
                  rows="3"
                  placeholder="e.g., Due to venue maintenance, please shift check-in to 2 days later..."
                  value={rescheduleNote}
                  onChange={function(e) { setRescheduleNote(e.target.value); }}
                ></textarea>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={function() { setRescheduleModalId(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-teal"
                    onClick={function() { handleSendReschedule(rescheduleModalId); }}
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
                <h6 className="modal-title fw-bold text-navy">Manager Itemized Guest Invoice</h6>
                <button type="button" className="btn-close" onClick={function() { setSelectedReceipt(null); }}></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-3">
                  <h5 className="fw-bold text-navy mb-0">{selectedReceipt.propertyName}</h5>
                  <div className="small text-muted">Invoice Reference #{String(selectedReceipt.id).slice(-8)}</div>
                </div>

                <div className="border rounded p-3 mb-3 small bg-light">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Guest Account:</span>
                    <strong>{selectedReceipt.userName}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Stay Dates:</span>
                    <span>{selectedReceipt.checkIn} to {selectedReceipt.checkOut}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Units / Headcount:</span>
                    <span>{selectedReceipt.guests} Guests ({selectedReceipt.unitCount} {selectedReceipt.rateUnit || "units"})</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Current Status:</span>
                    <span className="badge bg-teal">{selectedReceipt.status}</span>
                  </div>
                </div>

                <div className="small border-top pt-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Gross Total:</span>
                    <strong>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.localTotal || selectedReceipt.total).toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-muted">
                    <span>USD Equivalence:</span>
                    <span>~${selectedReceipt.usdTotal || selectedReceipt.total} USD</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Advance Collected:</span>
                    <span>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.advancePaid || Math.round(selectedReceipt.total * 0.5)).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-secondary">
                    <span>Remaining Balance:</span>
                    <span>{selectedReceipt.currencySymbol || "$"} {(selectedReceipt.balanceDue || Math.round(selectedReceipt.total * 0.5)).toLocaleString()}</span>
                  </div>
                  {selectedReceipt.rescheduleProposal && (
                    <div className="alert alert-warning py-1 px-2 small mt-2 mb-0">
                      <strong>Directive:</strong> {selectedReceipt.rescheduleProposal}
                    </div>
                  )}
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
    </div>
  );
}
