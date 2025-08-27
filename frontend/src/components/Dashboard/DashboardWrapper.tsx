import React from "react";
import Dashboard from "./Dashboard";
import Header from "../Header/Header";

// Dashboard wrapper component - handles layout and header
const DashboardWrapper: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Fixed Header */}
      <Header />

      {/* Content with reduced top padding to minimize gap */}
      <div className="pt-20">
        {/* Dashboard Content */}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardWrapper;
