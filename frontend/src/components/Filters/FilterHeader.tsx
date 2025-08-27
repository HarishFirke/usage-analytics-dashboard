import React from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";

interface FilterHeaderProps {
  isExpanded: boolean;
  hasActiveFilters: boolean;
  onToggleExpansion: () => void;
  onClearFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  isExpanded,
  hasActiveFilters,
  onToggleExpansion,
  onClearFilters,
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center text-gray-800">
          <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
            <Filter className="h-2 w-2 text-white" />
          </div>
          Filters
        </CardTitle>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="px-2 py-1 h-6 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpansion}
            className="p-1 h-6 w-6 hover:bg-gray-100 rounded text-gray-500"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default FilterHeader;
