import { UserActivity } from "../types/analytics";

// Get top 10 users from the list
export const getTop10Users = (topUsers: UserActivity[]): UserActivity[] => {
  return topUsers.slice(0, 10);
};

// Check if there are no users or empty array
export const hasNoUsers = (topUsers?: UserActivity[]): boolean => {
  return !topUsers || topUsers.length === 0;
};

// Get rank styling based on position
export const getRankStyling = (
  index: number
): {
  bgColor: string;
  icon?: boolean;
  text?: string;
} => {
  if (index === 0) {
    return {
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      icon: true,
    };
  } else if (index === 1) {
    return {
      bgColor: "bg-gradient-to-br from-gray-400 to-gray-600",
      text: (index + 1).toString(),
    };
  } else if (index === 2) {
    return {
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
      text: (index + 1).toString(),
    };
  } else {
    return {
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      text: (index + 1).toString(),
    };
  }
};

// Format user email for display (show only username part)
export const formatUserEmail = (email: string): string => {
  return `${email.split("@")[0]}...`;
};

// Format event count with locale string
export const formatEventCount = (count: number): string => {
  return count.toLocaleString();
};

// User rank data interface
export interface UserRankData {
  user: UserActivity;
  index: number;
  rankStyling: ReturnType<typeof getRankStyling>;
  formattedEmail: string;
  formattedEventCount: string;
}

// Get processed user rank data
export const getUserRankData = (topUsers: UserActivity[]): UserRankData[] => {
  return getTop10Users(topUsers).map((user, index) => ({
    user,
    index,
    rankStyling: getRankStyling(index),
    formattedEmail: formatUserEmail(user.email),
    formattedEventCount: formatEventCount(user.eventCount),
  }));
};
