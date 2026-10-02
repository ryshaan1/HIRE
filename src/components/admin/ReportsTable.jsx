export default function ReportsTable({ reports = [], onResolveReport }) {
  if (reports.length === 0) {
    return <div className="text-center text-muted p-4">No user complaints or reports received yet.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-muted">
            <th>Venue</th>
            <th>Reported By</th>
            <th>Reason</th>
            <th>Notes</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(function(r) {
            return (
              <tr key={r.id}>
                <td className="fw-semibold small">{r.propertyName}</td>
                <td className="small text-muted">{r.reporterEmail} <span className="badge bg-light text-dark">({r.reporterRole})</span></td>
                <td><span className="badge bg-warning text-dark">{r.reason}</span></td>
                <td className="small text-secondary" style={{ maxWidth: "250px" }}>{r.notes}</td>
                <td className="small text-muted">{r.date}</td>
                <td>
                  <span className={`badge ${r.status === "Resolved" ? "bg-success" : "bg-danger"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="text-end">
                  {r.status !== "Resolved" && (
                    <button type="button" className="btn btn-outline-success btn-sm py-0 px-2" onClick={function() { onResolveReport(r.id); }}>
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
