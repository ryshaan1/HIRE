import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getSession } from "../../utils/storage.js";
import CurrencySelector from "../common/CurrencySelector.jsx";

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [compareCount, setCompareCount] = useState(function() {
    const list = getSession("hire_compare", []);
    return list.length;
  });

  function syncCompareCount() {
    const list = getSession("hire_compare", []);
    setCompareCount(list.length);
  }

  useEffect(function() {
    window.addEventListener("hire_compare_updated", syncCompareCount);
    window.addEventListener("storage", syncCompareCount);

    return function() {
      window.removeEventListener("hire_compare_updated", syncCompareCount);
      window.removeEventListener("storage", syncCompareCount);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg hire-navbar shadow-sm sticky-top">
      <div className="container hire-container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="hire-brand-text">HIRE</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hireNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="hireNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">Search</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-1" to="/compare">
                Compare
                <span className="badge rounded-pill bg-light text-dark border ms-1">
                  {compareCount}
                </span>
              </NavLink>
            </li>

            {currentUser && (
              <>
                {currentUser.role === "customer" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/user-dashboard">My Bookings</NavLink>
                  </li>
                )}
                {currentUser.role === "critic" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/critic">Critic Workspace</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/user-dashboard">My Stays &amp; Ledger</NavLink>
                    </li>
                  </>
                )}
                {currentUser.role === "manager" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/manager">Manager Dashboard</NavLink>
                  </li>
                )}
                {currentUser.role === "admin" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">Admin Console</NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <CurrencySelector compact={true} />
            {currentUser ? (
              <div className="d-flex align-items-center gap-3">
                <span className="small text-muted">
                  Logged in as <strong className="text-capitalize text-teal">{currentUser.name || currentUser.role}</strong>
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-teal">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-sm btn-teal">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
