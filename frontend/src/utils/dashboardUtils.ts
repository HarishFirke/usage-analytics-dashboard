import { AnalyticsResponse } from "../types/analytics";

/**
 * Check if data is empty due to date range (not due to no data at all)
 */
export const isEmptyDueToDateRange = (
  analytics: AnalyticsResponse | null
): boolean => {
  if (!analytics) return false;

  // If we have companies but no events, it's likely due to date range
  return analytics.companies.length > 0 && analytics.summary.totalEvents === 0;
};

/**
 * Check if there's no data at all in the system
 */
export const isNoDataAtAll = (analytics: AnalyticsResponse | null): boolean => {
  if (!analytics) return false;

  return (
    analytics.companies.length === 0 &&
    analytics.summary.totalEvents === 0 &&
    analytics.topUsers.length === 0
  );
};

/**
 * Check if filters have changed from initial values
 */
export const hasFilterChanges = (
  appliedFilters: any,
  initialValues: any
): boolean => {
  return (
    appliedFilters.dateRange !== initialValues.dateRange ||
    appliedFilters.companyId !== initialValues.companyId ||
    appliedFilters.search !== initialValues.search ||
    appliedFilters.fromDate !== initialValues.fromDate ||
    appliedFilters.toDate !== initialValues.toDate
  );
};
