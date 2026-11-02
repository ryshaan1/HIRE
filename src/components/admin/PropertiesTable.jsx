import { formatPriceInfo } from "../../utils/pricing.js";

export default function PropertiesTable({ properties = [], onOpenModal, onQuickStatusChange }) {
  function getAvg(type) {
    const list = properties.filter(function(p) { return p.type && p.type.includes(type); });
    if (list.length === 0) return 150;
    return list.reduce(function(acc, item) { return acc + Number(item.price); }, 0) / list.length;
  }

  const avgHotel = getAvg("Hotel");
  const avgInn = getAvg("Inn");
  const avgRest = getAvg("Restaurant");

  function isSuspicious(property) {
    let avg = 150;
    if (property.type.includes("Hotel")) avg = avgHotel;
    else if (property.type.includes("Inn")) avg = avgInn;
    else if (property.type.includes("Restaurant")) avg = avgRest;
    return property.price > avg * 1.7 || Number(property.rating) < 2.5;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-muted">
            <th>Venue</th>
            <th>Type</th>
            <th>Location</th>
            <th>Pricing &amp; Rate Structure</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Reason(s) &amp; Directives</th>
            <th className="text-end">Moderation</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(function(p) {
            const suspicious = isSuspicious(p);
            const priceInfo = formatPriceInfo(p);
            return (
              <tr key={p.id} className={p.unflagRequested ? "table-warning bg-opacity-25" : ""}>
                <td className="small">
                  <div className="d-flex align-items-center gap-2">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="rounded border object-fit-cover shadow-sm flex-shrink-0"
                        style={{ width: "52px", height: "38px" }}
                      />
                    ) : (
                      <div
                        className="rounded border bg-light text-muted d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "52px", height: "38px", fontSize: "0.62rem" }}
                      >
                        No Pic
                      </div>
                    )}
                    <div>
                      <span className="fw-semibold text-navy d-block">{p.name}</span>
                      {p.branches && p.branches > 1 && (
                        <span className="badge bg-light text-muted border" style={{ fontSize: "0.68rem" }}>
                          {p.branches} branches
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="small">{p.type}</td>
                <td className="small">{p.city}, {p.country}</td>
                <td className="small">
                  <div className="fw-bold text-navy">
                    {priceInfo.displayPrice} <span className="text-muted fw-normal small">{priceInfo.unitDisplay}</span>
                  </div>
                  {priceInfo.secondaryPrice && (
                    <div className="text-teal" style={{ fontSize: "0.72rem" }}>
                      ${priceInfo.secondaryPrice} <span className="text-muted">({priceInfo.secondaryLabel})</span>
                    </div>
                  )}
                </td>
                <td className="small text-warning">★ {Number(p.rating).toFixed(1)}</td>
                <td>
                  <span className={`badge ${
                    p.status === "active" ? "bg-success" :
                    p.status === "flagged" ? "bg-warning text-dark" :
                    p.status === "pending_admission" ? "bg-info text-dark" : "bg-danger"
                  }`}>
                    {p.status}
                  </span>
                  {p.unflagRequested && (
                    <div className="mt-1">
                      <span className="badge bg-primary text-white" style={{ fontSize: "0.68rem" }}>
                        Unflag Requested
                      </span>
                    </div>
                  )}
                </td>
                <td className="small">
                  {p.flagReason && (
                    <div className="mb-1">
                      <span className="text-warning-emphasis fw-semibold small d-block mb-1">Flag Reasons:</span>
                      <div className="d-flex flex-wrap gap-1">
                        {p.flagReason.split(", ").map(function(r, idx) {
                          return <span key={idx} className="badge bg-warning text-dark border" style={{ fontSize: "0.7rem" }}>{r}</span>;
                        })}
                      </div>
                    </div>
                  )}
                  {p.flagNotes && (
                    <div className="text-muted small mt-1">
                      <strong>Directive:</strong> {p.flagNotes}
                    </div>
                  )}
                  {p.unflagNotes && (
                    <div className="alert alert-info py-1 px-2 my-1 small mb-0" style={{ fontSize: "0.75rem" }}>
                      <strong>Manager Note:</strong> {p.unflagNotes}
                    </div>
                  )}
                  {p.banReason && (
                    <div className="text-danger fw-semibold">
                      <span className="d-block small mb-1">Ban Violations:</span>
                      <div className="d-flex flex-wrap gap-1">
                        {p.banReason.split(", ").map(function(r, idx) {
                          return <span key={idx} className="badge bg-danger text-white" style={{ fontSize: "0.7rem" }}>{r}</span>;
                        })}
                      </div>
                      {p.banNotes && <div className="text-muted fw-normal small mt-1"><strong>Audit:</strong> {p.banNotes}</div>}
                    </div>
                  )}
                  {suspicious && !p.flagReason && !p.banReason && (
                    <span className="badge bg-danger-subtle text-danger border border-danger">Suspicious Signal</span>
                  )}
                  {!p.flagReason && !p.banReason && !suspicious && !p.unflagRequested && (
                    <span className="text-muted">&mdash;</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    {p.status === "pending_admission" && (
                      <>
                        <button type="button" className="btn btn-outline-success btn-sm py-0 px-2" onClick={function() { onQuickStatusChange(p.id, "active"); }}>Admit</button>
                        <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={function() { onQuickStatusChange(p.id, "rejected"); }}>Reject</button>
                      </>
                    )}
                    {p.status === "active" && (
                      <>
                        <button type="button" className="btn btn-outline-warning btn-sm py-0 px-2" onClick={function() { onOpenModal(p, "flag"); }}>Flag</button>
                        <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={function() { onOpenModal(p, "ban"); }}>Ban</button>
                      </>
                    )}
                    {p.status === "flagged" && (
                      <>
                        <button
                          type="button"
                          className={`btn btn-sm py-0 px-2 ${p.unflagRequested ? "btn-success" : "btn-outline-success"}`}
                          onClick={function() { onQuickStatusChange(p.id, "active"); }}
                        >
                          {p.unflagRequested ? "Approve Unflag" : "Unflag"}
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={function() { onOpenModal(p, "ban"); }}>Ban</button>
                      </>
                    )}
                    {p.status === "banned" && (
                      <button type="button" className="btn btn-outline-success btn-sm py-0 px-2" onClick={function() { onQuickStatusChange(p.id, "active"); }}>Remove Ban</button>
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
