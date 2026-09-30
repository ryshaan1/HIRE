import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, recordUndoSnapshot, undoLastAction, getUndoHistory } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import PropertiesTable from "../admin/PropertiesTable.jsx";
import CriticsTable from "../admin/CriticsTable.jsx";
import ReportsTable from "../admin/ReportsTable.jsx";
import FlagBanModal from "../admin/FlagBanModal.jsx";

export default function AdminDashboard() {
  const { users, approveCritic, banUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState(function() {
    return getShared("hire_properties", initialProperties);
  });
  const [reports, setReports] = useState(function() {
    return getShared("hire_reports", []);
  });
  const [modalTarget, setModalTarget] = useState(null);
  const [undoHistory, setUndoHistory] = useState(function() {
    return getUndoHistory();
  });
  const [actionAlert, setActionAlert] = useState("");

  // Real-time synchronization across all localhost tabs / windows
  useEffect(function() {
    const unsubscribe = subscribeToSync(function(event) {
      const freshProps = getShared("hire_properties", initialProperties);
      const freshReports = getShared("hire_reports", []);
      setProperties(freshProps);
      setReports(freshReports);
      setUndoHistory(getUndoHistory());

      if (event && event.type === "UNFLAG_REQUESTED") {
        setActionAlert(`Manager of "${event.data?.propertyName || "a venue"}" just submitted an unflag request.`);
      } else if (event && event.type === "REPORT_SUBMITTED") {
        setActionAlert(`New user report received for "${event.data?.propertyName || "a venue"}".`);
      }
    });

    return unsubscribe;
  }, []);

  function handleQuickStatusChange(id, newStatus) {
    const targetProp = properties.find(function(p) { return p.id === id; });
    const prevSnapshot = { properties: [...properties], reports: [...reports] };
    recordUndoSnapshot(`Changed ${targetProp ? targetProp.name : "venue"} status to ${newStatus}`, prevSnapshot);

    const nextList = properties.map(function(p) {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          flagReason: newStatus === "active" ? null : p.flagReason,
          flagNotes: newStatus === "active" ? null : p.flagNotes,
          banReason: newStatus === "active" ? null : p.banReason,
          banNotes: newStatus === "active" ? null : p.banNotes,
          unflagRequested: false,
          unflagNotes: null
        };
      }
      return p;
    });
    setProperties(nextList);
    setShared("hire_properties", nextList);
    setUndoHistory(getUndoHistory());
  }

  function handleConfirmModal(id, status, reason, directiveNote = "") {
    const targetProp = properties.find(function(p) { return p.id === id; });
    const prevSnapshot = { properties: [...properties], reports: [...reports] };
    recordUndoSnapshot(`${status === "flagged" ? "Flagged" : "Banned"} ${targetProp ? targetProp.name : "venue"}`, prevSnapshot);

    const nextList = properties.map(function(p) {
      if (p.id === id) {
        return {
          ...p,
          status: status,
          flagReason: status === "flagged" ? reason : null,
          flagNotes: status === "flagged" ? directiveNote : null,
          banReason: status === "banned" ? reason : null,
          banNotes: status === "banned" ? directiveNote : null,
          unflagRequested: false,
          unflagNotes: null
        };
      }
      return p;
    });
    setProperties(nextList);
    setShared("hire_properties", nextList);
    setUndoHistory(getUndoHistory());
    setModalTarget(null);
  }

  function handleResolveReport(reportId) {
    const prevSnapshot = { properties: [...properties], reports: [...reports] };
    recordUndoSnapshot(`Resolved user report #${reportId}`, prevSnapshot);

    const nextReports = reports.map(function(r) {
      return r.id === reportId ? { ...r, status: "Resolved" } : r;
    });
    setReports(nextReports);
    setShared("hire_reports", nextReports);
    setUndoHistory(getUndoHistory());
  }

  function handleUndo() {
    const undone = undoLastAction();
    if (undone) {
      setProperties(getShared("hire_properties", initialProperties));
      setReports(getShared("hire_reports", []));
      setUndoHistory(getUndoHistory());
      setActionAlert(`Undone: ${undone.label}`);
      setTimeout(function() { setActionAlert(""); }, 4000);
    }
  }

  const flaggedCount = properties.filter(function(p) { return p.status === "flagged"; }).length;
  const pendingAdmissionCount = properties.filter(function(p) { return p.status === "pending_admission"; }).length;
  const verifiedCriticsCount = users.filter(function(u) { return u.role === "critic" && u.isApproved; }).length;
  const unflagRequests = properties.filter(function(p) { return p.status === "flagged" && p.unflagRequested; });

  return (
    <div className="hire-admin py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-0">Admin Dashboard</h4>
          <span className="small text-muted">Platform Governance, Admission &amp; Moderation Console (Live Synced)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          {undoHistory.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary shadow-sm"
              onClick={handleUndo}
              title={`Undo: ${undoHistory[0].label}`}
            >
              ↺ Undo: {undoHistory[0].label}
            </button>
          )}
          <span className="badge bg-danger p-2">Administrator Access</span>
        </div>
      </div>

      {actionAlert && (
        <div className="alert alert-info py-2 px-3 small d-flex justify-content-between align-items-center mb-3">
          <span>🔔 {actionAlert}</span>
          <button type="button" className="btn-close btn-sm" onClick={function() { setActionAlert(""); }}></button>
        </div>
      )}

      {/* Pending Unflag Notification Banner */}
      {unflagRequests.length > 0 && (
        <div className="alert alert-warning border border-warning shadow-sm mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <strong className="text-dark">🔔 Unflag Request Pending ({unflagRequests.length}):</strong>
              <span className="small ms-2">
                Manager of <strong>{unflagRequests[0].name}</strong> reports issues resolved:
                <em> "{unflagRequests[0].unflagNotes || "All requested fixes completed"}"</em>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-success fw-semibold shadow-sm"
              onClick={function() { handleQuickStatusChange(unflagRequests[0].id, "active"); }}
            >
              Approve &amp; Unflag {unflagRequests[0].name}
            </button>
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border rounded bg-white p-3 text-center">
            <span className="text-muted small">Properties</span>
            <span className="fs-3 fw-bold text-navy">{properties.length}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border rounded bg-white p-3 text-center">
            <span className="text-muted small">Flagged Listings</span>
            <span className="fs-3 fw-bold text-warning">{flaggedCount}</span>
            {unflagRequests.length > 0 && (
              <span className="badge bg-primary mt-1" style={{ fontSize: "0.68rem" }}>
                {unflagRequests.length} unflag requested
              </span>
            )}
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border rounded bg-white p-3 text-center">
            <span className="text-muted small">Pending Admission</span>
            <span className="fs-3 fw-bold text-info">{pendingAdmissionCount}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border rounded bg-white p-3 text-center">
            <span className="text-muted small">Verified Critics</span>
            <span className="fs-3 fw-bold text-teal">{verifiedCriticsCount}</span>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border rounded bg-white">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2">
            {[
              { id: "properties", label: `Properties (${properties.length})` },
              { id: "critics", label: `Critics & Users (${users.length})` },
              { id: "reports", label: `User Reports (${reports.filter(function(r) { return r.status !== "Resolved"; }).length})` }
            ].map(function(tab) {
              return (
                <li className="nav-item" key={tab.id}>
                  <button
                    type="button"
                    className={`nav-link small fw-semibold border-0 ${
                      activeTab === tab.id ? "active text-teal border-bottom border-teal border-2" : "text-muted"
                    }`}
                    onClick={function() { setActiveTab(tab.id); }}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card-body p-3">
          {activeTab === "properties" && (
            <PropertiesTable
              properties={properties}
              onOpenModal={function(prop, action) { setModalTarget({ property: prop, actionType: action }); }}
              onQuickStatusChange={handleQuickStatusChange}
            />
          )}
          {activeTab === "critics" && (
            <CriticsTable users={users} onApproveCritic={approveCritic} onBanUser={banUser} />
          )}
          {activeTab === "reports" && (
            <ReportsTable reports={reports} onResolveReport={handleResolveReport} />
          )}
        </div>
      </div>

      {modalTarget && (
        <FlagBanModal
          property={modalTarget.property}
          actionType={modalTarget.actionType}
          onConfirm={handleConfirmModal}
          onClose={function() { setModalTarget(null); }}
        />
      )}
    </div>
  );
}
