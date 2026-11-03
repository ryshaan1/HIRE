import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, getSession, setSession, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import PropertyCard from "../common/PropertyCard.jsx";
import CurrencySelector from "../common/CurrencySelector.jsx";
import heroImg from "../../assets/hero.png";
import featureFindImg from "../../assets/feature_find.jpg";
import featureCompareImg from "../../assets/feature_compare.jpg";
import featureReviewsImg from "../../assets/feature_reviews.jpg";

export default function Home() {
  const { currentUser } = useContext(AuthContext);
  const [properties, setProperties] = useState(function() {
    const list = getShared("hire_properties", initialProperties);
    return list.filter(function(p) { return p.status !== "pending_admission"; });
  });
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
        setCompareMsg("Comparison limit reached (max 2 properties). Remove one to add another.");
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

  const featured = properties.slice(0, 6);

  return (
    <div className="hire-home">
      <div
        className="hero-banner text-center rounded mb-5 shadow-sm text-white position-relative overflow-hidden d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 44, 69, 0.42), rgba(19, 44, 69, 0.58)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          minHeight: "480px",
          width: "100%",
          padding: "80px 24px"
        }}
      >
        <div className="position-relative" style={{ zIndex: 1, maxWidth: "720px" }}>
          <h1 className="display-4 fw-bold text-white mb-2" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>HIRE</h1>
          <p className="fs-5 text-light mb-4 mx-auto" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)", fontWeight: "400" }}>
            Hotels, Inns &amp; Restaurants Ecosystem. Discover curated stays, authentic dining, and expert critic ratings worldwide.
          </p>
          <div className="d-flex justify-content-center gap-3">
            {currentUser ? (
              <Link to="/search" className="btn btn-teal px-4 py-2 fw-semibold shadow">
                Explore All Venues
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-teal px-4 py-2 fw-semibold shadow">
                  Login
                </Link>
                <Link to="/search" className="btn btn-outline-light px-4 py-2 fw-semibold shadow-sm">
                  Browse as Guest
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {compareMsg && <div className="alert alert-warning py-2 px-3 small text-center mb-4">{compareMsg}</div>}

      <section className="mb-5">
        <h4 className="text-navy fw-bold text-center mb-4">Why people use HIRE</h4>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border rounded overflow-hidden shadow-sm">
              <div style={{ height: "190px", overflow: "hidden" }}>
                <img
                  src={featureFindImg}
                  alt="Find the right place"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-navy mb-2">Find the right place</h6>
                  <p className="text-muted small mb-0">Explore verified hotels, tranquil inns, and premier dining spots across major global destinations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border rounded overflow-hidden shadow-sm">
              <div style={{ height: "190px", overflow: "hidden" }}>
                <img
                  src={featureCompareImg}
                  alt="Compare before you book"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-navy mb-2">Compare before you book</h6>
                  <p className="text-muted small mb-0">Side-by-side amenity, pricing, and timing comparisons help you lock in the ideal venue tailored to your budget.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border rounded overflow-hidden shadow-sm">
              <div style={{ height: "190px", overflow: "hidden" }}>
                <img
                  src={featureReviewsImg}
                  alt="Honest critic reviews"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-navy mb-2">Honest critic reviews</h6>
                  <p className="text-muted small mb-0">Make confident reservations backed by licensed food and hospitality critics with verified multi-criteria ratings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h4 className="text-navy fw-bold mb-0">Featured properties</h4>
            <span className="small text-muted">Showing local price, USD equivalent, and selected converted currency</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <CurrencySelector />
            <Link to="/search" className="text-teal small text-decoration-none fw-semibold">Browse all &rarr;</Link>
          </div>
        </div>
        <div className="row g-3">
          {featured.map(function(item) {
            const isCompared = compareList.some(function(c) { return c.id === item.id; });
            return (
              <div className="col-12 col-md-4" key={item.id}>
                <PropertyCard property={item} isCompared={isCompared} onToggleCompare={handleToggleCompare} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 pt-4 border-top">
        <div className="card bg-light border p-4 rounded text-center shadow-sm">
          <h6 className="fw-bold text-navy mb-2">About HIRE Project</h6>
          <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: "750px" }}>
            HIRE is a comprehensive booking and review ecosystem designed to unite guests, property managers, verified food and hospitality critics, and platform administrators. Built with React and client-side persistence, HIRE enables side-by-side property comparison, multi-criteria critic scorecards, dynamic photo uploads, live discount controls, and transparent administrative governance.
          </p>
        </div>
      </section>
    </div>
  );
}
