import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";

export default function Login() {
  const { login, loginAsPropertyManager } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [criticEmail, setCriticEmail] = useState("");
  const [criticPassword, setCriticPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [hotelPassword, setHotelPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [properties, setProperties] = useState(function() {
    return getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
  });

  const from = location.state && location.state.from ? location.state.from.pathname : "/";

  useEffect(function() {
    const list = getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
    setProperties(list);
    if (list.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(String(list[0].id));
    }

    const unsubscribe = subscribeToSync(function() {
      const updated = getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
      setProperties(updated);
    });
    return unsubscribe;
  }, []);

  const selectedProp = properties.find(function(p) { return String(p.id) === String(selectedPropertyId); });

  async function handleCustomerLogin(e) {
    e.preventDefault();
    if (!email || !password) { setErrorMsg("Please enter email and password."); return; }
    const res = await login(email, password);
    if (!res.success) { setErrorMsg(res.message); return; }
    navigate(from === "/login" ? "/user-dashboard" : from);
  }

  function handleManagerLogin(e) {
    e.preventDefault();
    if (!selectedProp) { setErrorMsg("Please select a venue."); return; }
    const res = loginAsPropertyManager(selectedProp, hotelPassword);
    if (!res.success) { setErrorMsg(res.message); return; }
    navigate("/manager");
  }

  async function handleCriticLogin(e) {
    e.preventDefault();
    if (!criticEmail || !criticPassword) { setErrorMsg("Please enter critic credentials."); return; }
    const res = await login(criticEmail, criticPassword);
    if (!res.success) { setErrorMsg(res.message); return; }
    navigate("/critic");
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    if (!adminEmail || !adminPassword) { setErrorMsg("Please enter admin credentials."); return; }
    const res = await login(adminEmail, adminPassword);
    if (!res.success) { setErrorMsg(res.message); return; }
    navigate("/admin");
  }

  return (
    <div className="hire-login py-5" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div className="card shadow-sm border p-4 rounded bg-white">
        <h4 className="fw-bold text-navy mb-1 text-center">Sign in to HIRE</h4>
        <p className="text-muted small mb-4 text-center">Select your account portal to sign in.</p>

        <div className="d-flex p-1 bg-light rounded mb-4 gap-1">
          {[
            { id: "customer", label: "Guest" },
            { id: "manager", label: "Manager" },
            { id: "critic", label: "Critic" },
            { id: "admin", label: "Admin" }
          ].map(function(tab) {
            return (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm flex-grow-1 fw-semibold ${
                  activeTab === tab.id ? "btn-teal shadow-sm" : "text-secondary border-0"
                }`}
                onClick={function() { setActiveTab(tab.id); setErrorMsg(""); }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-3">{errorMsg}</div>}

        {activeTab === "customer" && (
          <form onSubmit={handleCustomerLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Customer Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Enter your email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Enter password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">
              Sign in as Guest
            </button>
            <div className="text-center small">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/signup" className="text-teal text-decoration-none fw-semibold">Sign up</Link>
            </div>
          </form>
        )}

        {activeTab === "manager" && (
          <form onSubmit={handleManagerLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Select Managed Property</label>
              <select
                className="form-select form-select-sm"
                value={selectedPropertyId}
                onChange={function(e) { setSelectedPropertyId(e.target.value); }}
              >
                {properties.map(function(prop) {
                  return (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} ({prop.city}, {prop.country})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Manager Security Key / Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Enter venue manager password"
                value={hotelPassword}
                onChange={function(e) { setHotelPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">
              Sign in as Venue Manager
            </button>
          </form>
        )}

        {activeTab === "critic" && (
          <form onSubmit={handleCriticLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Critic Email Address</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Enter verified critic email"
                value={criticEmail}
                onChange={function(e) { setCriticEmail(e.target.value); }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Critic Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Enter critic password"
                value={criticPassword}
                onChange={function(e) { setCriticPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">
              Sign in as Verified Critic
            </button>
          </form>
        )}

        {activeTab === "admin" && (
          <form onSubmit={handleAdminLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Administrator Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={function(e) { setAdminEmail(e.target.value); }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Administrator Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={function(e) { setAdminPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">
              Sign in as Platform Administrator
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
