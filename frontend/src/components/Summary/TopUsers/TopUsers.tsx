import React from "react";
import { Card } from "../../../shared/ui/card";
import { UserActivity } from "../../../types/analytics";
import { hasNoUsers } from "../../../utils/topUsersUtils";
import EmptyState from "../../../shared/components/EmptyState";
import TopUsersHeader from "./TopUsersHeader";
import UsersList from "./UsersList";
import { Users } from "lucide-react";
import LoadingState from "../../../shared/components/LoadingState";

interface TopUsersProps {
  topUsers: UserActivity[];
  loading?: boolean;
}

const TopUsers: React.FC<TopUsersProps> = ({ topUsers, loading = false }) => {
  if (loading) {
    return (
      <LoadingState
        height="h-[680px]"
        contentHeight="h-[590px]"
        showSkeleton={true}
      />
    );
  }

  if (hasNoUsers(topUsers)) {
    return (
      <EmptyState
        title="Top Users"
        subtitle="Users with highest event counts"
        icon={Users}
        iconBgColor="bg-blue-500"
        message="No user activity data available"
        height="h-[680px]"
        contentHeight="h-[590px]"
      />
    );
  }

  return (
    <Card className="h-[680px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <TopUsersHeader />
      <UsersList topUsers={topUsers} />
    </Card>
  );
};

export default TopUsers;
