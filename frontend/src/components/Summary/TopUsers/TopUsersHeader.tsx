import React from "react";
import { CardHeader, CardTitle } from "../../../shared/ui/card";
import { Users } from "lucide-react";

const TopUsersHeader: React.FC = () => {
  return (
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
  );
};

export default TopUsersHeader;
