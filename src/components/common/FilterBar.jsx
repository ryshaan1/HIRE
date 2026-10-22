export default function FilterBar({
  searchQuery,
  onSearchChange,
  locationQuery,
  onLocationChange,
  selectedType,
  onTypeChange,
  maxBudget,
  onBudgetChange,
  selectedCuisine,
  onCuisineChange,
  cuisineOptions = [],
  minStay,
  onMinStayChange,
  onReset
}) {
  return (
    <div className="card shadow-sm border p-3 mb-4 bg-white rounded">
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold text-muted mb-1">Search by Property Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. The Grand Oberoi Palace, Woodland Inn..."
            value={searchQuery}
            onChange={function(e) { onSearchChange(e.target.value); }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold text-muted mb-1">Location (City or Country)</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. Mumbai, Tokyo, France..."
            value={locationQuery}
            onChange={function(e) { onLocationChange(e.target.value); }}
          />
        </div>
      </div>

      <div className="row g-2 align-items-end">
        <div className="col-6 col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Property Type</label>
          <select className="form-select form-select-sm" value={selectedType} onChange={function(e) { onTypeChange(e.target.value); }}>
            <option value="All">All Types</option>
            <option value="Hotel">Hotel</option>
            <option value="Inn">Inn</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Max Budget: ${maxBudget}</label>
          <input
            type="range"
            className="form-range"
            min="40"
            max="400"
            step="10"
            value={maxBudget}
            onChange={function(e) { onBudgetChange(Number(e.target.value)); }}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Cuisine Type</label>
          <select className="form-select form-select-sm" value={selectedCuisine} onChange={function(e) { onCuisineChange(e.target.value); }}>
            <option value="All">All Cuisine Types</option>
            {cuisineOptions.map(function(item) {
              return <option key={item} value={item}>{item}</option>;
            })}
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold text-muted mb-1">Min Stay</label>
          <select className="form-select form-select-sm" value={minStay} onChange={function(e) { onMinStayChange(Number(e.target.value)); }}>
            <option value="0">Any Duration</option>
            <option value="1">1+ Nights</option>
            <option value="2">2+ Nights</option>
          </select>
        </div>

        <div className="col-12 col-md-1 d-flex">
          <button type="button" className="btn btn-sm btn-outline-secondary w-100" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
