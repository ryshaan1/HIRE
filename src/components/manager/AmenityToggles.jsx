import { useState } from "react";

export default function AmenityToggles({ amenities = [], onChange, disabled = false }) {
  const standardList = [
    "Free WiFi",
    "Pool",
    "Gym",
    "Restaurant",
    "Parking",
    "Room Service",
    "Spa"
  ];

  const [newAmenityName, setNewAmenityName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Custom amenities are those in `amenities` that aren't in `standardList`
  const customAmenities = amenities.filter(function(a) {
    return !standardList.some(function(std) {
      return std.toLowerCase() === (a.name || "").toLowerCase();
    });
  });

  function getAmenityState(name) {
    const found = amenities.find(function(a) {
      return a.name.toLowerCase() === name.toLowerCase();
    });
    return found || { name: name, available: false, underRepair: false };
  }

  function handleToggleAvailable(name) {
    if (disabled) return;
    const current = getAmenityState(name);
    const updated = { ...current, available: !current.available };
    if (!updated.available) {
      updated.underRepair = false;
    }
    updateList(name, updated);
  }

  function handleToggleRepair(name) {
    if (disabled) return;
    const current = getAmenityState(name);
    const updated = { ...current, underRepair: !current.underRepair };
    updateList(name, updated);
  }

  function updateList(name, updatedItem) {
    let exists = false;
    const nextList = amenities.map(function(item) {
      if (item.name.toLowerCase() === name.toLowerCase()) {
        exists = true;
        return updatedItem;
      }
      return item;
    });
    if (!exists) {
      nextList.push(updatedItem);
    }
    onChange(nextList);
  }

  function handleAddCustomAmenity(e) {
    if (e) e.preventDefault();
    if (disabled) return;

    const trimmed = newAmenityName.trim();
    if (!trimmed) {
      setErrorMsg("Please enter an amenity name.");
      setTimeout(function() { setErrorMsg(""); }, 3000);
      return;
    }

    const duplicateInStandard = standardList.some(function(s) {
      return s.toLowerCase() === trimmed.toLowerCase();
    });
    const duplicateInCustom = amenities.some(function(a) {
      return a.name.toLowerCase() === trimmed.toLowerCase();
    });

    if (duplicateInStandard || duplicateInCustom) {
      setErrorMsg(`"${trimmed}" is already in the amenities list.`);
      setTimeout(function() { setErrorMsg(""); }, 3500);
      return;
    }

    const newAmenity = {
      name: trimmed,
      available: true,
      underRepair: false
    };

    const nextList = [...amenities, newAmenity];
    onChange(nextList);
    setNewAmenityName("");
    setErrorMsg("");
    setSuccessMsg(`Added "${trimmed}" as a venue amenity!`);
    setTimeout(function() { setSuccessMsg(""); }, 3500);
  }

  function handleRemoveCustom(nameToRemove) {
    if (disabled) return;
    const nextList = amenities.filter(function(a) {
      return a.name.toLowerCase() !== nameToRemove.toLowerCase();
    });
    onChange(nextList);
    setSuccessMsg(`Removed "${nameToRemove}".`);
    setTimeout(function() { setSuccessMsg(""); }, 2500);
  }

  return (
    <div className="card shadow-sm border p-3 mb-4 rounded bg-white">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h6 className="fw-bold text-navy mb-0">Amenity Status &amp; Custom Amenities</h6>
          <span className="text-muted small">Enable features, toggle repair status, or add custom venue amenities</span>
        </div>
        <div className="d-flex gap-1">
          <span className="badge bg-light text-dark border">
            {amenities.filter(function(a) { return a.available; }).length} Active
          </span>
          {customAmenities.length > 0 && (
            <span className="badge bg-teal-subtle text-teal border border-teal">
              +{customAmenities.length} Custom
            </span>
          )}
        </div>
      </div>

      <p className="text-muted small mb-3">
        Guests see active amenities on your property page and search cards. Mark amenities &quot;Under repair&quot; during maintenance to prevent compliance flags.
      </p>

      {errorMsg && <div className="alert alert-warning py-1 px-3 small mb-3">⚠️ {errorMsg}</div>}
      {successMsg && <div className="alert alert-success py-1 px-3 small mb-3">✓ {successMsg}</div>}

      {/* Standard Amenities Table */}
      <div className="table-responsive mb-3">
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr className="text-muted small">
              <th>Standard Amenity</th>
              <th className="text-center" style={{ width: "120px" }}>Available</th>
              <th className="text-center" style={{ width: "140px" }}>Under Repair</th>
            </tr>
          </thead>
          <tbody>
            {standardList.map(function(name) {
              const state = getAmenityState(name);
              return (
                <tr key={name}>
                  <td className="fw-semibold small">{name}</td>
                  <td className="text-center">
                    <div className="form-check form-switch d-inline-block">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        disabled={disabled}
                        checked={Boolean(state.available)}
                        onChange={function() { handleToggleAvailable(name); }}
                      />
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="form-check form-switch d-inline-block">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        disabled={disabled || !state.available}
                        checked={Boolean(state.underRepair)}
                        onChange={function() { handleToggleRepair(name); }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Custom Amenities Section (if any exist) */}
      {customAmenities.length > 0 && (
        <div className="mb-3">
          <span className="small fw-bold text-navy d-block mb-2">Custom Added Amenities</span>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr className="text-muted small">
                  <th>Amenity Name</th>
                  <th className="text-center" style={{ width: "120px" }}>Available</th>
                  <th className="text-center" style={{ width: "140px" }}>Under Repair</th>
                  <th className="text-end" style={{ width: "80px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customAmenities.map(function(a) {
                  return (
                    <tr key={a.name}>
                      <td className="small">
                        <span className="fw-semibold text-navy me-2">{a.name}</span>
                        <span className="badge bg-light text-muted border" style={{ fontSize: "0.68rem" }}>Custom</span>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            disabled={disabled}
                            checked={Boolean(a.available)}
                            onChange={function() { handleToggleAvailable(a.name); }}
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            disabled={disabled || !a.available}
                            checked={Boolean(a.underRepair)}
                            onChange={function() { handleToggleRepair(a.name); }}
                          />
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2"
                          disabled={disabled}
                          onClick={function() { handleRemoveCustom(a.name); }}
                          title="Remove custom amenity"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Custom Amenity Input */}
      <div className="border-top pt-3">
        <label className="form-label small fw-bold text-navy mb-1">
          + Add Other / Custom Amenity
        </label>
        <p className="text-muted small mb-2" style={{ fontSize: "0.78rem" }}>
          Offer unique facilities? Add EV charging, rooftop lounge, pet friendly, beach access, airport shuttle, etc.
        </p>
        <div className="input-group input-group-sm">
          <input
            type="text"
            className="form-control"
            placeholder="Type amenity name (e.g. EV Charging Station, Valet Parking, Pet Friendly)..."
            value={newAmenityName}
            disabled={disabled}
            onChange={function(e) { setNewAmenityName(e.target.value); }}
            onKeyDown={function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomAmenity(e);
              }
            }}
          />
          <button
            type="button"
            className="btn btn-teal px-3"
            disabled={disabled || !newAmenityName.trim()}
            onClick={handleAddCustomAmenity}
          >
            + Add Amenity
          </button>
        </div>
      </div>
    </div>
  );
}
