/* eslint-disable react/prop-types */
// AdminRoutes.js
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/features/auth/authSlice"; // আপনার path অনুযায়ী adjust করুন

const AdminRoutes = ({ children }) => {
  const dispatch = useDispatch();

  // localStorage থেকে token এবং user পড়া
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // Token বা user না থাকলে auth route এ redirect
  if (!token || !userStr) {
    return <Navigate to="/auth" replace />;
  }


  // If admin, render the requested admin route component
  return <>{children}</>;
};

export default AdminRoutes;
