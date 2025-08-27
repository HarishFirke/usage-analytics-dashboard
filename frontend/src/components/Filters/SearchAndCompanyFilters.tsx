import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/select";
import { companyOptions } from "../../utils/filtersUtils";

interface SearchAndCompanyFiltersProps {
  searchValue: string;
  companyId: string;
  onSearchChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onSearchKeyPress: (event: React.KeyboardEvent) => void;
}

const SearchAndCompanyFilters: React.FC<SearchAndCompanyFiltersProps> = ({
  searchValue,
  companyId,
  onSearchChange,
  onCompanyChange,
  onSearchKeyPress,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Search Input */}
      <div className="md:col-span-2 w-full">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            className="pl-8 h-10 w-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg"
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyPress={onSearchKeyPress}
          />
        </div>
      </div>

      {/* Company Filter */}
      <div className="w-full">
        <Select value={companyId || "all"} onValueChange={onCompanyChange}>
          <SelectTrigger className="h-10 w-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            {companyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchAndCompanyFilters;
