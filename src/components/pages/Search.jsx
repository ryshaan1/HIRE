import { useState, useEffect } from "react";
import { getShared, getSession, setSession, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import FilterBar from "../common/FilterBar.jsx";
import PropertyCard from "../common/PropertyCard.jsx";

export default function Search() {
  const [properties, setProperties] = useState(function() {
    const list = getShared("hire_properties", initialProperties);
    return list.filter(function(p) { return p.status !== "pending_admission"; });
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [maxBudget, setMaxBudget] = useState(1000);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [minStay, setMinStay] = useState(0);
  const [compareList, setCompareList] = useState(function() {
    return getSession("hire_compare", []);
  });
  const [compareMsg, setCompareMsg] = useState("");

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const list = getShared("hire_properties", initialProperties);
      setProperties(list.filter(function(p) { return p.status !== "pending_admission"; }));
      setCompareList(getSession("hire_compare", []));
    });

    return unsubscribe;
  }, []);

  function handleToggleCompare(prop) {
    const exists = compareList.find(function(p) { return p.id === prop.id; });
    let updated;
    if (exists) {
      updated = compareList.filter(function(p) { return p.id !== prop.id; });
      setCompareMsg("");
    } else {
      if (compareList.length >= 2) {
        setCompareMsg("Comparison limit reached (max 2 properties). Remove one first.");
        setTimeout(function() { setCompareMsg(""); }, 3500);
        return;
      }
      updated = [...compareList, prop];
      setCompareMsg("");
    }
    setCompareList(updated);
    setSession("hire_compare", updated);
    window.dispatchEvent(new Event("hire_compare_updated"));
  }

  function handleReset() {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedType("All");
    setMaxBudget(1000);
    setSelectedCuisine("All");
    setMinStay(0);
  }

  const cuisineOptions = [
    "Asian", "Indian", "Middle Eastern", "French", "Italian",
    "Japanese", "European", "American", "Seafood", "Latin American", "African", "Turkish"
  ];

  const filtered = properties.filter(function(p) {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (locationQuery) {
      const q = locationQuery.toLowerCase();
      if (!p.city.toLowerCase().includes(q) && !p.country.toLowerCase().includes(q)) return false;
    }
    if (selectedType !== "All" && !p.type.includes(selectedType)) return false;
    const eff = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
    if (eff > maxBudget) return false;
    if (selectedCuisine !== "All" && p.cuisine !== selectedCuisine) return false;
    if (minStay > 0 && (p.minStay || 1) < minStay) return false;
    return true;
  });

  return (
    <div className="hire-search py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-navy mb-0">Find a place to stay or eat</h4>
        <span className="text-muted small">{filtered.length} properties found</span>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        maxBudget={maxBudget}
        onBudgetChange={setMaxBudget}
        selectedCuisine={selectedCuisine}
        onCuisineChange={setSelectedCuisine}
        cuisineOptions={cuisineOptions}
        minStay={minStay}
        onMinStayChange={setMinStay}
        onReset={handleReset}
      />

      {compareMsg && <div className="alert alert-warning py-2 px-3 small text-center mb-3">{compareMsg}</div>}

      {filtered.length === 0 ? (
        <div className="card p-5 text-center text-muted border rounded bg-white shadow-sm my-4">
          <p className="fs-5 mb-1 text-secondary fw-semibold">Not available for the selected filters</p>
          <p className="small mb-3">Try adjusting your filters, location, or budget range.</p>
          <button type="button" className="btn btn-sm btn-teal d-inline-block mx-auto" onClick={handleReset}>Reset Filters</button>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(function(prop) {
            const isCompared = compareList.some(function(c) { return c.id === prop.id; });
            return (
              <div className="col-12 col-sm-6 col-md-4" key={prop.id}>
                <PropertyCard property={prop} isCompared={isCompared} onToggleCompare={handleToggleCompare} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
