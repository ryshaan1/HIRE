export default function CriticsTable({ users = [], onApproveCritic, onBanUser, onUpdateUserStatus }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-muted">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Valid</th>
            <th>Licence #</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(function(u) {
            const isCritic = u.role === "critic";
            const displayRole = u.role === "customer" ? "normal user" : u.role;
            const displayStatus = u.status || (isCritic ? (u.isApproved ? "Approved" : "Pending Approval") : (u.isBanned ? "Banned" : "Valid"));
            const isValid = u.valid !== false && !u.isBanned && u.status !== "Banned" && u.status !== "Suspended";

            return (
              <tr key={u.email}>
                <td className="fw-semibold small">{u.name || "Anonymous"}</td>
                <td className="small">{u.email}</td>
                <td className="small">
                  <span className="badge bg-light text-dark border">
                    {displayRole}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      displayStatus === "Valid" || displayStatus === "Approved" || displayStatus === "Active"
                        ? "bg-success"
                        : displayStatus === "Pending Approval" || displayStatus === "Pending"
                        ? "bg-warning text-dark"
                        : displayStatus === "Warned"
                        ? "bg-info text-dark"
                        : displayStatus === "Flagged"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {displayStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge ${isValid ? "bg-success-subtle text-success border border-success" : "bg-danger-subtle text-danger border border-danger"}`}>
                    {isValid ? "Valid" : "Invalid"}
                  </span>
                </td>
                <td className="small font-monospace">{u.licenceNumber || "N/A"}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    {isCritic && (
                      <button
                        type="button"
                        className={`btn btn-sm py-0 px-2 ${
                          u.isApproved ? "btn-outline-secondary" : "btn-outline-success"
                        }`}
                        onClick={function() { onApproveCritic(u.email, !u.isApproved); }}
                      >
                        {u.isApproved ? "Revoke" : "Approve"}
                      </button>
                    )}
                    {u.role !== "admin" && onUpdateUserStatus && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm py-0 px-2 btn-outline-warning"
                          onClick={function() { onUpdateUserStatus(u.email, "Warned"); }}
                        >
                          Warn
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm py-0 px-2 btn-outline-danger"
                          onClick={function() { onUpdateUserStatus(u.email, "Flagged"); }}
                        >
                          Flag
                        </button>
                      </>
                    )}
                    {u.role !== "admin" && (
                      <button
                        type="button"
                        className={`btn btn-sm py-0 px-2 ${
                          u.isBanned ? "btn-outline-success" : "btn-outline-dark"
                        }`}
                        onClick={function() { onBanUser(u.email, !u.isBanned); }}
                      >
                        {u.isBanned ? "Unban" : "Ban"}
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
  );
}
