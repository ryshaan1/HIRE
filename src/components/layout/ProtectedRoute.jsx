import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.role === "manager") {
      return <Navigate to="/manager" replace />;
    }
    if (currentUser.role === "critic") {
      return <Navigate to="/critic" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
