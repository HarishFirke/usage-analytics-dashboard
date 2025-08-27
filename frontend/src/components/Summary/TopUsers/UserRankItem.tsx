import React from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { UserRankData } from "../../../utils/topUsersUtils";

interface UserRankItemProps {
  userRank: UserRankData;
}

const UserRankItem: React.FC<UserRankItemProps> = ({ userRank }) => {
  const { user, rankStyling, formattedEmail, formattedEventCount } = userRank;

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 group">
      <div className="flex items-center space-x-3">
        {/* Rank indicator with improved styling */}
        <div className="flex-shrink-0">
          {rankStyling.icon ? (
            <div
              className={`w-8 h-8 ${rankStyling.bgColor} rounded-full flex items-center justify-center shadow-md`}
            >
              <Trophy className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${rankStyling.bgColor}`}
            >
              {rankStyling.text}
            </div>
          )}
        </div>

        {/* User information with improved typography */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">
            {formattedEmail}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {user.companyName}
          </p>
        </div>
      </div>

      {/* Event count with improved styling */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
          {formattedEventCount}
        </span>
      </div>
    </div>
  );
};

export default UserRankItem;
