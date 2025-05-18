import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ isAuthenticated, openLoginPopup }) => {
  if (!isAuthenticated) {
    openLoginPopup();
    return null; // Prevent rendering until login is handled
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  openLoginPopup: PropTypes.func.isRequired,
};

export default ProtectedRoute;