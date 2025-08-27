import React, { useState, useCallback, useEffect } from "react";
import { QueryParams } from "../../types/analytics";
import { Card } from "../../shared/ui/card";
import { initialFilterValues } from "../../hooks/useAnalytics";
import {
  hasChangesToApply,
  hasActiveFilters,
  getDateValidationError,
} from "../../utils/filtersUtils";
import FilterHeader from "./FilterHeader";
import FilterContent from "./FilterContent";

interface FiltersProps {
  params: QueryParams;
  onParamsChange: (params: Partial<QueryParams>) => void;
  onApply: () => void;
  loading?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  params,
  onParamsChange,
  onApply,
}) => {
  const [localSearch, setLocalSearch] = useState(params.search);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previousAppliedParams, setPreviousAppliedParams] =
    useState<QueryParams>(params);

  // Show success message briefly when filters are applied
  const handleApplyWithSuccess = () => {
    onApply();
    setPreviousAppliedParams({ ...params });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onParamsChange({ search: value });
  };

  // Handle company change
  const handleCompanyChange = useCallback(
    (value: string) => {
      onParamsChange({ companyId: value });
    },
    [onParamsChange]
  );

  // Handle date range change
  const handleDateRangeChange = useCallback(
    (value: string) => {
      onParamsChange({ dateRange: parseInt(value) });
    },
    [onParamsChange]
  );

  // Handle from date change
  const handleFromDateChange = useCallback(
    (value: string) => {
      onParamsChange({ fromDate: value });
      setDateError(null);
    },
    [onParamsChange]
  );

  // Handle to date change
  const handleToDateChange = useCallback(
    (value: string) => {
      onParamsChange({ toDate: value });
      setDateError(null);
    },
    [onParamsChange]
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    onParamsChange({ search: localSearch });
  }, [localSearch, onParamsChange]);

  // Handle search key press
  const handleSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setDateError(null);
    setLocalSearch("");
    onParamsChange(initialFilterValues);
  }, [onParamsChange]);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // Check if there are actual changes to apply
  const changesToApply = hasChangesToApply(params, previousAppliedParams);

  // Check if any filter is currently active (different from defaults)
  const activeFilters = hasActiveFilters(params);

  // Validate dates when they change
  useEffect(() => {
    const error = getDateValidationError(
      params.fromDate || "",
      params.toDate || ""
    );
    setDateError(error);
  }, [params.fromDate, params.toDate]);

  // Update local search when params change externally
  useEffect(() => {
    setLocalSearch(params.search || "");
  }, [params.search]);

  return (
    <Card className="mb-4 shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <FilterHeader
        isExpanded={isExpanded}
        hasActiveFilters={activeFilters}
        onToggleExpansion={toggleExpansion}
        onClearFilters={handleClearFilters}
      />

      {isExpanded && (
        <FilterContent
          params={params}
          localSearch={localSearch || ""}
          dateError={dateError}
          showSuccess={showSuccess}
          hasChangesToApply={changesToApply}
          onSearchChange={handleSearchChange}
          onCompanyChange={handleCompanyChange}
          onDateRangeChange={handleDateRangeChange}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          onSearchKeyPress={handleSearchKeyPress}
          onApply={handleApplyWithSuccess}
        />
      )}
    </Card>
  );
};

export default Filters;
