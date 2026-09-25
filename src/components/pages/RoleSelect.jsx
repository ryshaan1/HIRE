import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function RoleSelect() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleQuickLogin(email, password, route) {
    const res = login(email, password);
    if (res.success) {
      navigate(route);
    }
  }

  const roles = [
    {
      title: "Critic",
      email: "critic@hire.com",
      password: "critic@123",
      route: "/critic",
      badge: "Verified Critic",
      desc: "Licensed hospitality reviewers. Multi-criteria ratings (cost, location, hygiene, food, amenities) with live formula scores."
    },
    {
      title: "Manager",
      email: "manager@hire.com",
      password: "manager@123",
      route: "/manager",
      badge: "The Grand Harbour Hotel",
      desc: "Hotel managers. Configure amenities, photo uploads (file & Ctrl+V), up to 6 FAQs, discounts, and booking approvals."
    },
    {
      title: "Admin",
      email: "admin@hire.com",
      password: "admin@123",
      route: "/admin",
      badge: "System Moderator",
      desc: "Superusers. Review listings, flag/ban with custom reasons, review user reports, approve hotel admissions, and verify critic licences."
    }
  ];

  return (
    <div className="hire-role-select py-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="text-center mb-4">
        <h4 className="fw-bold text-navy mb-1">Choose your role</h4>
        <p className="text-muted small">
          Quick-login with pre-configured demo credentials or explore administrative governance.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {roles.map(function(r) {
          return (
            <div className="col-12 col-md-4" key={r.title}>
              <div className="card h-100 shadow-sm border rounded bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-navy mb-0">{r.title}</h6>
                    <span className="badge bg-teal-subtle text-teal border border-teal" style={{ fontSize: "0.7rem" }}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-secondary small mb-3">{r.desc}</p>
                  <div className="bg-light p-2 rounded small text-muted font-monospace mb-3" style={{ fontSize: "0.75rem" }}>
                    <div>User: {r.email}</div>
                    <div>Pass: {r.password}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-teal w-100"
                  onClick={function() { handleQuickLogin(r.email, r.password, r.route); }}
                >
                  Log In as {r.title}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link to="/login" className="text-muted small text-decoration-none">
          &larr; Return to login
        </Link>
      </div>
    </div>
  );
}
