import React from "react";
import { Button } from "../../shared/ui/button";

interface FilterActionsProps {
  isApplyDisabled: boolean;
  hasChangesToApply: boolean;
  onApply: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  isApplyDisabled,
  hasChangesToApply,
  onApply,
}) => {
  return (
    <div className="flex w-full md:w-32">
      <Button
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors duration-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onApply}
        disabled={isApplyDisabled || !hasChangesToApply}
      >
        Apply
      </Button>
    </div>
  );
};

export default FilterActions;
