import { useState } from "react";

export default function FlagBanModal({ property, actionType, onConfirm, onClose }) {
  const isFlag = actionType === "flag";
  const flagReasons = [
    "Extra cost / Price gouging",
    "Too much under repair",
    "Hygiene concerns",
    "Misleading amenities",
    "Customer complaint reports",
    "Unverified pricing structure",
    "Suspiciousness",
    "Others"
  ];
  const banReasons = [
    "Severe hygiene violations",
    "Fraudulent pricing",
    "Fake / Unverified listing",
    "Terms of service violation",
    "Repeated guest safety complaints",
    "Suspiciousness",
    "Others"
  ];

  const options = isFlag ? flagReasons : banReasons;
  const [selectedReasons, setSelectedReasons] = useState([options[0]]);
  const [customNote, setCustomNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleToggleReason(opt) {
    if (selectedReasons.includes(opt)) {
      if (selectedReasons.length === 1) {
        setErrorMsg("Please keep at least one moderation reason selected.");
        setTimeout(function() { setErrorMsg(""); }, 3000);
        return;
      }
      setSelectedReasons(selectedReasons.filter(function(r) { return r !== opt; }));
    } else {
      setSelectedReasons([...selectedReasons, opt]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selectedReasons.length === 0) {
      setErrorMsg("Please select at least one moderation reason.");
      return;
    }
    if (selectedReasons.includes("Others") && !customNote.trim()) {
      setErrorMsg("Please provide details for 'Others' in the directive / audit note below.");
      return;
    }
    onConfirm(property.id, isFlag ? "flagged" : "banned", selectedReasons.join(", "), customNote.trim());
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1080 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h6 className="modal-title fw-bold text-navy mb-0">
              {isFlag ? "⚠️ Flag Venue" : "🚫 Ban Venue"}: {property.name}
            </h6>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Venue Image and Summary Card */}
              <div className="card mb-3 bg-light border p-2">
                <div className="d-flex align-items-center gap-3">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="rounded border shadow-sm object-fit-cover flex-shrink-0"
                      style={{ width: "72px", height: "54px" }}
                    />
                  ) : (
                    <div
                      className="rounded border bg-white text-muted d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: "72px", height: "54px", fontSize: "0.7rem" }}
                    >
                      No Photo
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="fw-bold text-navy text-truncate">{property.name}</div>
                    <div className="text-muted small">
                      <span className="text-capitalize">{property.type || "Stay"}</span> &bull; {property.city || property.location || "Location unlisted"}
                    </div>
                    {property.images && property.images.length > 1 && (
                      <div className="text-teal fw-semibold" style={{ fontSize: "0.72rem" }}>
                        📷 {property.images.length} photos available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-muted small mb-3">
                {isFlag
                  ? "Select one or more warning reasons to send to the venue manager so they can fix the issues. These will be recorded on the listing."
                  : "Select one or more violations to ban this venue. Banning permanently restricts operations and booking access."}
              </p>

              {errorMsg && <div className="alert alert-danger py-1 px-2 small mb-2">{errorMsg}</div>}

              {/* Multi-Select Checkboxes */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-muted mb-0">
                    Moderation Reasons (Select multiple)
                  </label>
                  <span className="badge bg-light text-dark border" style={{ fontSize: "0.72rem" }}>
                    {selectedReasons.length} selected
                  </span>
                </div>

                <div className="border rounded p-2 bg-light d-flex flex-column gap-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {options.map(function(opt) {
                    const isChecked = selectedReasons.includes(opt);
                    return (
                      <div className="form-check" key={opt}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`reason-${opt}`}
                          checked={isChecked}
                          onChange={function() { handleToggleReason(opt); }}
                        />
                        <label
                          className={`form-check-label small ${isChecked ? "fw-bold text-navy" : "text-secondary"}`}
                          htmlFor={`reason-${opt}`}
                          style={{ cursor: "pointer" }}
                        >
                          {opt}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Specific Directive for Manager {isFlag ? "(What needs fixing)" : "(Audit note)"}
                  {selectedReasons.includes("Others") && (
                    <span className="text-danger ms-1 fw-bold">* (Specify details for &apos;Others&apos;)</span>
                  )}
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder={
                    selectedReasons.includes("Others")
                      ? "Please explain the reason for 'Others' and required corrective actions..."
                      : isFlag
                      ? "e.g. Pool must be repaired or pricing adjusted to reflect closure..."
                      : "e.g. Repeated violation of platform hospitality rules..."
                  }
                  value={customNote}
                  onChange={function(e) { setCustomNote(e.target.value); }}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className={`btn btn-sm ${isFlag ? "btn-warning" : "btn-danger"} px-3`}>
                {isFlag ? `Confirm Flag (${selectedReasons.length} reasons)` : `Confirm Ban (${selectedReasons.length} reasons)`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
