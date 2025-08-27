import React from "react";
import { CardContent } from "../../../shared/ui/card";
import { UserActivity } from "../../../types/analytics";
import { getUserRankData } from "../../../utils/topUsersUtils";
import UserRankItem from "./UserRankItem";

interface UsersListProps {
  topUsers: UserActivity[];
}

const UsersList: React.FC<UsersListProps> = ({ topUsers }) => {
  const userRankData = getUserRankData(topUsers);

  return (
    <CardContent className="h-[590px] px-3 flex flex-col">
      <div className="space-y-4 max-h-[590px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {userRankData.map((userRank) => (
          <UserRankItem key={userRank.user.email} userRank={userRank} />
        ))}
      </div>
    </CardContent>
  );
};

export default UsersList;
