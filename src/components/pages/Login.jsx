import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, subscribeToSync } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { getHotelDemoPassword } from "../../utils/validators.js";

export default function Login() {
  const { login, loginAsPropertyManager } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMode, setLoginMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [properties, setProperties] = useState(function() {
    return getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState(function() {
    const list = getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
    return list.length > 0 ? String(list[0].id) : "";
  });
  const [hotelPassword, setHotelPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state && location.state.from ? location.state.from.pathname : "/";

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const list = getShared("hire_properties", initialProperties).filter(function(p) { return p.status !== "banned"; });
      setProperties(list);
    });
    return unsubscribe;
  }, []);

  const selectedProp = properties.find(function(p) { return String(p.id) === String(selectedPropertyId); });
  const suggestedHotelPass = selectedProp ? getHotelDemoPassword(selectedProp.name) : "the@123";

  function handleStandardLogin(e) {
    e.preventDefault();
    if (!email || !password) { setErrorMsg("Please fill in both email and password."); return; }
    const res = login(email, password);
    if (!res.success) { setErrorMsg(res.message); return; }
    redirectByRole(res.user.role);
  }

  function handleManagerLogin(e) {
    e.preventDefault();
    if (!selectedProp) { setErrorMsg("Please select a valid property."); return; }
    const res = loginAsPropertyManager(selectedProp, hotelPassword);
    if (!res.success) { setErrorMsg(res.message); return; }
    navigate("/manager");
  }

  function redirectByRole(role) {
    if (role === "admin") navigate("/admin");
    else if (role === "manager") navigate("/manager");
    else if (role === "critic") navigate("/critic");
    else navigate(from === "/login" ? "/search" : from);
  }

  return (
    <div className="hire-login py-5" style={{ maxWidth: "460px", margin: "0 auto" }}>
      <div className="card shadow-sm border p-4 rounded bg-white">
        <h4 className="fw-bold text-navy mb-1 text-center">Sign in to HIRE</h4>
        <p className="text-muted small mb-4 text-center">Access management consoles, critic tools, or travel bookings.</p>

        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn btn-sm ${loginMode === "email" ? "btn-teal" : "btn-outline-secondary"}`}
            onClick={function() { setLoginMode("email"); setErrorMsg(""); }}
          >
            Email Login
          </button>
          <button
            type="button"
            className={`btn btn-sm ${loginMode === "manager" ? "btn-teal" : "btn-outline-secondary"}`}
            onClick={function() { setLoginMode("manager"); setErrorMsg(""); }}
          >
            Hotel/Venue Manager
          </button>
        </div>

        {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-3">{errorMsg}</div>}

        {loginMode === "email" ? (
          <form onSubmit={handleStandardLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Email address</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="name@hire.com"
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
                placeholder="prefix@123"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">Sign in</button>
          </form>
        ) : (
          <form onSubmit={handleManagerLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Select Managed Venue</label>
              <select
                className="form-select form-select-sm"
                value={selectedPropertyId}
                onChange={function(e) { setSelectedPropertyId(e.target.value); }}
              >
                {properties.map(function(prop) {
                  return (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} ({prop.city})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Venue Access Key / Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder={`e.g. ${suggestedHotelPass} or manager@123`}
                value={hotelPassword}
                onChange={function(e) { setHotelPassword(e.target.value); }}
                required
              />
              <span className="form-text text-muted" style={{ fontSize: "0.75rem" }}>
                Demo hint: <code>{suggestedHotelPass}</code>
              </span>
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">Login as Venue Manager</button>
          </form>
        )}

        <div className="border-top pt-3 text-center">
          <span className="small text-muted">Quick login hint: </span>
          <Link to="/role-select" className="small text-teal text-decoration-none fw-semibold">One-Click Role Switcher &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
