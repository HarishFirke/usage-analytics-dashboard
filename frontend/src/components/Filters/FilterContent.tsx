import React from "react";
import { CardContent } from "../../shared/ui/card";
import SearchAndCompanyFilters from "./SearchAndCompanyFilters";
import DateFilters from "./DateFilters";
import FilterActions from "./FilterActions";
import FilterMessages from "./FilterMessages";
import { QueryParams } from "../../types/analytics";

interface FilterContentProps {
  params: QueryParams;
  localSearch: string;
  dateError: string | null;
  showSuccess: boolean;
  hasChangesToApply: boolean;
  onSearchChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSearchKeyPress: (event: React.KeyboardEvent) => void;
  onApply: () => void;
}

const FilterContent: React.FC<FilterContentProps> = ({
  params,
  localSearch,
  dateError,
  showSuccess,
  hasChangesToApply,
  onSearchChange,
  onCompanyChange,
  onDateRangeChange,
  onFromDateChange,
  onToDateChange,
  onSearchKeyPress,
  onApply,
}) => {
  return (
    <CardContent className="pt-0 px-4 pb-4">
      {/* Minimal Filter Layout */}
      <div className="space-y-4">
        {/* Top Row - Search and Company */}
        <SearchAndCompanyFilters
          searchValue={localSearch}
          companyId={params.companyId || "all"}
          onSearchChange={onSearchChange}
          onCompanyChange={onCompanyChange}
          onSearchKeyPress={onSearchKeyPress}
        />

        {/* Second Row - Date Controls and Apply Button */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Date Filters - Takes up most of the space */}
          <div className="flex-1">
            <DateFilters
              dateRange={params.dateRange || 90}
              fromDate={params.fromDate || ""}
              toDate={params.toDate || ""}
              onDateRangeChange={onDateRangeChange}
              onFromDateChange={onFromDateChange}
              onToDateChange={onToDateChange}
            />
          </div>

          {/* Action Buttons - Takes up remaining space */}
          <div className="w-full md:w-auto">
            <FilterActions
              isApplyDisabled={dateError !== null}
              hasChangesToApply={hasChangesToApply}
              onApply={onApply}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <FilterMessages dateError={dateError} showSuccess={showSuccess} />
    </CardContent>
  );
};

export default FilterContent;
