import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { defaultRoute } from ".";
import DashboardWrapper from "@/components/Dashboard/DashboardWrapper";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default route redirects to dashboard */}
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />

      {/* Dashboard route */}
      <Route path={defaultRoute} element={<DashboardWrapper />} />

      {/* Catch all other routes and redirect to dashboard */}
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
};

export default AppRoutes;
