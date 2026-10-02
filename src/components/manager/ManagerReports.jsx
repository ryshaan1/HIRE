export default function ManagerReports({ bookings = [], property }) {
  const totalBookings = bookings.length;
  const acceptedBookings = bookings.filter(function(b) {
    return b.status === "Accepted";
  });
  const revenue = acceptedBookings.reduce(function(acc, b) {
    return acc + Number(b.total || 0);
  }, 0);

  const monthsData = [
    { label: "Jan", count: 14 },
    { label: "Feb", count: 18 },
    { label: "Mar", count: 22 },
    { label: "Apr", count: 29 },
    { label: "May", count: 35 },
    { label: "Jun", count: 42 },
    { label: "Jul", count: 50 },
    { label: "Aug", count: 48 },
    { label: "Sep", count: 38 },
    { label: "Oct", count: totalBookings > 0 ? totalBookings + 20 : 25 }
  ];

  const maxVal = Math.max(...monthsData.map(function(m) { return m.count; })) || 50;

  return (
    <div className="card shadow-sm border p-4 rounded bg-white mb-4">
      <h6 className="fw-bold text-navy mb-3">Performance &amp; Revenue Reports</h6>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded text-center bg-light">
            <span className="d-block text-muted small">Total Bookings</span>
            <span className="fs-4 fw-bold text-navy">{totalBookings}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded text-center bg-light">
            <span className="d-block text-muted small">Accepted</span>
            <span className="fs-4 fw-bold text-teal">{acceptedBookings.length}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded text-center bg-light">
            <span className="d-block text-muted small">Average Rating</span>
            <span className="fs-4 fw-bold text-warning">
              ★ {Number(property.rating || 4.5).toFixed(1)}
            </span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded text-center bg-light">
            <span className="d-block text-muted small">Confirmed Revenue</span>
            <span className="fs-4 fw-bold text-success">${revenue}</span>
          </div>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small fw-bold text-navy">Monthly Bookings Overview</span>
          <span className="small text-muted">2026 Volume</span>
        </div>

        <div className="d-flex align-items-end justify-content-between gap-2" style={{ height: "140px" }}>
          {monthsData.map(function(m) {
            const heightPercent = Math.round((m.count / maxVal) * 100);
            return (
              <div key={m.label} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                <span className="small text-muted" style={{ fontSize: "0.7rem" }}>
                  {m.count}
                </span>
                <div
                  className="rounded-top w-100"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: "#0f8f84",
                    minHeight: "4px",
                    opacity: 0.85
                  }}
                  title={`${m.label}: ${m.count} bookings`}
                ></div>
                <span className="small text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
