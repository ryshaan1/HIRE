import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, broadcastAction } from "../../utils/storage.js";

export default function ReportModal({ property, onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [reason, setReason] = useState("Hygiene concerns");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const reportReasons = [
    "Extra cost / Price gouging",
    "Too much under repair",
    "Hygiene concerns",
    "Misleading amenities or info",
    "Poor service or misconduct",
    "Food safety issue",
    "Suspiciousness",
    "Others"
  ];

  function handleSubmit(e) {
    e.preventDefault();
    const newReport = {
      id: Date.now(),
      propertyId: property.id,
      propertyName: property.name,
      reporterEmail: currentUser ? currentUser.email : "anonymous_guest@hire.com",
      reporterRole: currentUser ? currentUser.role : "guest",
      reason: reason,
      notes: notes.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "Pending"
    };
    const existing = getShared("hire_reports", []);
    const updated = [newReport, ...existing];
    setShared("hire_reports", updated);
    broadcastAction("REPORT_SUBMITTED", {
      propertyId: property.id,
      propertyName: property.name,
      reason: reason,
      reporterEmail: newReport.reporterEmail
    });
    setSuccess(true);
    setTimeout(function() {
      onClose();
    }, 1500);
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h6 className="modal-title fw-bold text-navy mb-0">Report Issue: {property.name}</h6>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {success ? (
            <div className="modal-body text-center py-4">
              <div className="text-success fs-2 mb-2">&check;</div>
              <h6 className="fw-bold text-navy">Report Submitted to Administration</h6>
              <p className="text-muted small mb-0">Platform administrators will inspect this venue in real time.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Report this property for pricing, sanitation, or service issues. All reports are directly forwarded to the Admin moderation console.
                </p>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Reason for Report</label>
                  <select className="form-select form-select-sm" value={reason} onChange={function(e) { setReason(e.target.value); }}>
                    {reportReasons.map(function(r) { return <option key={r} value={r}>{r}</option>; })}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Additional Observations</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder="Provide specific details..."
                    value={notes}
                    onChange={function(e) { setNotes(e.target.value); }}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-sm btn-danger px-3">Submit Report</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
