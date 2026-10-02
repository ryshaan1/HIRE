export default function ManagerBookings({ bookings = [], onUpdateStatus }) {
  if (bookings.length === 0) {
    return (
      <div className="card shadow-sm border p-4 text-center text-muted rounded bg-white">
        No guest bookings received yet.
      </div>
    );
  }

  return (
    <div className="card shadow-sm border rounded bg-white p-3 mb-4">
      <h6 className="fw-bold text-navy mb-3">Current Bookings</h6>
      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr className="text-muted small">
              <th>Booking ID</th>
              <th>Guest Name</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(function(b) {
              return (
                <tr key={b.id}>
                  <td className="small fw-semibold">#{String(b.id).slice(-6)}</td>
                  <td className="small">{b.userName || b.userEmail}</td>
                  <td className="small">{b.checkIn}</td>
                  <td className="small">{b.checkOut}</td>
                  <td className="small">{b.guests}</td>
                  <td className="small fw-bold text-teal">${b.total}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "Accepted"
                          ? "bg-success"
                          : b.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="text-end">
                    {b.status === "Pending" ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm py-0 px-2"
                          onClick={function() { onUpdateStatus(b.id, "Accepted"); }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          onClick={function() { onUpdateStatus(b.id, "Rejected"); }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">Resolved</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
