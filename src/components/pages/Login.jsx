import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
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

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotRole, setForgotRole] = useState("customer");
  const [forgotSuccess, setForgotSuccess] = useState("");

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

  function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    const newRequest = {
      id: Date.now(),
      email: forgotEmail.trim().toLowerCase(),
      role: forgotRole,
      status: "Pending Admin Review",
      adminNote: "Awaiting administrator review and dispatch.",
      createdAt: new Date().toISOString()
    };

    const currentRequests = getShared("hire_password_requests", []);
    const nextRequests = [newRequest, ...currentRequests];
    setShared("hire_password_requests", nextRequests);
    broadcastAction("PASSWORD_REQUEST_SUBMITTED", newRequest);

    try {
      fetch("http://localhost:5000/api/password-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newRequest.email, role: newRequest.role })
      }).catch(function() {});
    } catch (err) {}

    setForgotSuccess("Password recovery request submitted to Platform Admin (admin@hire.com). Admin will review your account and dispatch recovery credentials.");
    setTimeout(function() {
      setForgotSuccess("");
      setShowForgotModal(false);
      setForgotEmail("");
    }, 4500);
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
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small text-muted mb-0">Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none text-muted"
                  style={{ fontSize: "0.75rem" }}
                  onClick={function() { setShowPassword(!showPassword); }}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-sm"
                placeholder="Enter password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                required
              />
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-teal"
                style={{ fontSize: "0.78rem" }}
                onClick={function() { setShowForgotModal(true); setForgotRole("customer"); }}
              >
                Forgot password?
              </button>
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
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small text-muted mb-0">Manager Security Key / Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none text-muted"
                  style={{ fontSize: "0.75rem" }}
                  onClick={function() { setShowPassword(!showPassword); }}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-sm"
                placeholder="Enter venue manager password"
                value={hotelPassword}
                onChange={function(e) { setHotelPassword(e.target.value); }}
                required
              />
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-teal"
                style={{ fontSize: "0.78rem" }}
                onClick={function() { setShowForgotModal(true); setForgotRole("manager"); }}
              >
                Forgot password?
              </button>
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
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small text-muted mb-0">Critic Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none text-muted"
                  style={{ fontSize: "0.75rem" }}
                  onClick={function() { setShowPassword(!showPassword); }}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-sm"
                placeholder="Enter critic password"
                value={criticPassword}
                onChange={function(e) { setCriticPassword(e.target.value); }}
                required
              />
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-teal"
                style={{ fontSize: "0.78rem" }}
                onClick={function() { setShowForgotModal(true); setForgotRole("critic"); }}
              >
                Forgot password?
              </button>
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
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small text-muted mb-0">Administrator Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none text-muted"
                  style={{ fontSize: "0.75rem" }}
                  onClick={function() { setShowPassword(!showPassword); }}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-sm"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={function(e) { setAdminPassword(e.target.value); }}
                required
              />
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-teal"
                style={{ fontSize: "0.78rem" }}
                onClick={function() { setShowForgotModal(true); setForgotRole("admin"); }}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" className="btn btn-teal w-100 py-2 mb-3 fw-semibold">
              Sign in as Platform Administrator
            </button>
          </form>
        )}
      </div>

      {showForgotModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header py-2 bg-light">
                <h6 className="modal-title fw-bold text-navy">Account Password Recovery</h6>
                <button type="button" className="btn-close" onClick={function() { setShowForgotModal(false); }}></button>
              </div>
              <div className="modal-body p-3">
                {forgotSuccess ? (
                  <div className="alert alert-success py-2 px-3 small mb-0">
                    {forgotSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <p className="small text-muted mb-3">
                      Enter your registered account email. A password recovery request will be forwarded to Platform Administration (admin@hire.com) for verification and mail dispatch.
                    </p>
                    <div className="mb-3">
                      <label className="form-label small text-muted">Registered Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="e.g. user@example.com"
                        value={forgotEmail}
                        onChange={function(e) { setForgotEmail(e.target.value); }}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-muted">Account Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={forgotRole}
                        onChange={function(e) { setForgotRole(e.target.value); }}
                      >
                        <option value="customer">Guest / Customer</option>
                        <option value="manager">Venue Manager</option>
                        <option value="critic">Licensed Critic</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={function() { setShowForgotModal(false); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-teal fw-semibold"
                      >
                        Send Request to Admin
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
