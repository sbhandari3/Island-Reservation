import React from "react";
import { Navigate } from "react-router-dom";

// Wrapper component that redirects to sign in page if unauthorized
const ProtectedRoute = ({ isLoggedIn, children }) => {
 if (!isLoggedIn) {
   return <Navigate to="/user/signin" />;
 }
 return children;
};
export default ProtectedRoute;
