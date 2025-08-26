import React from "react";
import { Users, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { UserActivity } from "../../types/analytics";

interface TopActiveUsersProps {
  topUsers: UserActivity[];
  loading?: boolean;
}

const TopActiveUsers: React.FC<TopActiveUsersProps> = ({
  topUsers,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="h-[500px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Top Active Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topUsers || topUsers.length === 0) {
    return (
      <Card className="h-[290px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center text-gray-800">
            <div className="w-5 h-5 mr-2 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-3 w-3 text-white" />
            </div>
            Top Users
          </CardTitle>
          <p className="text-xs text-gray-500 font-medium">
            Users with highest event counts
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-4">
          <div className="flex items-center justify-center h-[190px]">
            <p className="text-muted-foreground text-center">
              No user activity data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get top 5 users
  const top5Users = topUsers.slice(0, 5);

  return (
    <Card className="h-[305px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center text-gray-800">
          <div className="w-5 h-5 mr-2 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="h-3 w-3 text-white" />
          </div>
          Top Users
        </CardTitle>
        <p className="text-xs text-gray-500 font-medium">
          Users with highest event counts
        </p>
      </CardHeader>
      <CardContent className="pt-0 px-4">
        <div className="space-y-1 max-h-[205px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {top5Users.map((user, index) => (
            <div
              key={user.email}
              className="flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {/* Enhanced Rank Badge */}
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white ring-2 ring-yellow-200"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-400 to-gray-600 text-white ring-2 ring-gray-200"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white ring-2 ring-orange-200"
                      : "bg-gradient-to-br from-blue-400 to-blue-600 text-white ring-2 ring-blue-200"
                  }`}
                >
                  {index === 0 ? <Trophy className="h-3 w-3" /> : index + 1}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors duration-300">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-medium group-hover:text-blue-600 transition-colors duration-300">
                    {user.companyName}
                  </p>
                </div>
              </div>

              {/* Enhanced Event Count */}
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-2 w-2 text-green-600" />
                </div>
                <span className="text-sm font-bold text-green-700 group-hover:text-green-800 transition-colors duration-300">
                  {user.eventCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopActiveUsers;
