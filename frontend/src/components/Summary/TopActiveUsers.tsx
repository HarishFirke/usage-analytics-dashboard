import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trophy, TrendingUp, Users } from "lucide-react";
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
      <Card className="h-[400px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            Top Users
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Users with highest event counts
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topUsers || topUsers.length === 0) {
    return (
      <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            Top Users
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Users with highest event counts
          </p>
        </CardHeader>
        <CardContent className="h-[410px] px-3 flex items-center justify-center">
          <div className="flex items-center justify-center h-[280px]">
            <p className="text-muted-foreground text-center">
              No user activity data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const top10Users = topUsers.slice(0, 10);

  return (
    <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          Top Users
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Users with highest event counts
        </p>
      </CardHeader>
      <CardContent className="h-[480px] px-3 flex flex-col">
        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {top10Users.map((user, index) => (
            <div
              key={user.email}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                {/* Rank indicator with improved styling */}
                <div className="flex-shrink-0">
                  {index === 0 ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        index === 1
                          ? "bg-gradient-to-br from-gray-400 to-gray-600"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-600"
                          : "bg-gradient-to-br from-blue-400 to-blue-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* User information with improved typography */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">
                    {`${user.email.split("@")[0]}...`}
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
                  {user.eventCount.toLocaleString()}
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
