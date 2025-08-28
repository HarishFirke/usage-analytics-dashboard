import React from "react";
import { RouteObject } from "react-router-dom";
import DashboardWrapper from "../components/Dashboard/DashboardWrapper";

// Simple route configuration
export const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardWrapper />,
  },
];

// Default route path
export const defaultRoute = "/dashboard";
