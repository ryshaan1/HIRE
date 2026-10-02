export default function CriticsTable({ users = [], onApproveCritic, onBanUser }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-muted">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Licence #</th>
            <th>Critic Status</th>
            <th>Account Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(function(u) {
            const isCritic = u.role === "critic";
            return (
              <tr key={u.email}>
                <td className="fw-semibold small">{u.name || "Anonymous"}</td>
                <td className="small">{u.email}</td>
                <td className="small text-capitalize">{u.role}</td>
                <td className="small font-monospace">{u.licenceNumber || "N/A"}</td>
                <td>
                  {isCritic ? (
                    <span
                      className={`badge ${
                        u.isApproved ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {u.isApproved ? "Approved" : "Pending"}
                    </span>
                  ) : (
                    <span className="text-muted small">&mdash;</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${u.isBanned ? "bg-danger" : "bg-light text-dark border"}`}>
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
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
                    {u.role !== "admin" && (
                      <button
                        type="button"
                        className={`btn btn-sm py-0 px-2 ${
                          u.isBanned ? "btn-outline-success" : "btn-outline-danger"
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
