import { useState } from "react";

export default function PasswordRequestsTable({ requests = [], onDispatchRecovery }) {
  const [selectedReq, setSelectedReq] = useState(null);
  const [tempPassword, setTempPassword] = useState("HireRecovery@2026");
  const [adminNote, setAdminNote] = useState("Password reset approved and dispatched by platform administrator.");

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center text-muted">
        No password recovery requests logged.
      </div>
    );
  }

  function handleDispatch() {
    if (!selectedReq) return;
    onDispatchRecovery(selectedReq.id || selectedReq._id, {
      tempPassword: tempPassword.trim(),
      adminNote: adminNote.trim(),
      status: "Dispatched by Admin"
    });
    setSelectedReq(null);
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-sm align-middle small mb-0">
          <thead className="table-light">
            <tr>
              <th>Date / Time</th>
              <th>User Email</th>
              <th>Account Role</th>
              <th>Status</th>
              <th>Resolution Directive</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(function(r) {
              const isPending = r.status === "Pending Admin Review" || !r.status;
              const isDispatched = r.status === "Dispatched by Admin" || r.status === "Resolved";

              return (
                <tr key={r.id || r._id}>
                  <td className="text-muted">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "Recent"}
                  </td>
                  <td className="fw-semibold text-navy">{r.email}</td>
                  <td>
                    <span className="badge bg-light text-dark border text-capitalize">
                      {r.role || "customer"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${isPending ? "bg-warning text-dark" : "bg-success"}`}>
                      {r.status || "Pending Admin Review"}
                    </span>
                  </td>
                  <td className="text-muted" style={{ maxWidth: "260px" }}>
                    {r.adminNote || (isPending ? "Awaiting admin dispatch" : "Credentials sent")}
                    {r.tempPassword && (
                      <div className="small text-teal fw-semibold mt-1">
                        Temp Pass: {r.tempPassword}
                      </div>
                    )}
                  </td>
                  <td className="text-end">
                    {isPending ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-teal py-0 px-2 fw-semibold"
                        onClick={function() { setSelectedReq(r); }}
                      >
                        Dispatch Recovery Mail
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        onClick={function() { setSelectedReq(r); }}
                      >
                        Re-dispatch
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header py-2 bg-light">
                <h6 className="modal-title fw-bold text-navy">Dispatch Password Recovery Email</h6>
                <button type="button" className="btn-close" onClick={function() { setSelectedReq(null); }}></button>
              </div>
              <div className="modal-body p-3">
                <div className="border rounded p-2 mb-3 bg-light small">
                  <div><strong>Target User Email:</strong> {selectedReq.email}</div>
                  <div><strong>Account Category:</strong> {selectedReq.role || "customer"}</div>
                  <div><strong>Requested At:</strong> {selectedReq.createdAt ? new Date(selectedReq.createdAt).toLocaleString() : "Recent"}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Generated Temporary Recovery Password</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={tempPassword}
                    onChange={function(e) { setTempPassword(e.target.value); }}
                    required
                  />
                  <div className="form-text small" style={{ fontSize: "0.72rem" }}>
                    User can log in using this password and update credentials.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Admin Recovery Directive / Email Body</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    value={adminNote}
                    onChange={function(e) { setAdminNote(e.target.value); }}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={function() { setSelectedReq(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-teal fw-semibold"
                    onClick={handleDispatch}
                  >
                    Confirm &amp; Send Mail to User
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
