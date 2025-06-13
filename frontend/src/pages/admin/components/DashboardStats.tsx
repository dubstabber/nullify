import { useMusicStore } from "@/stores/useMusicStore";
import StatsCard from "./StatsCard";
import { ListMusic, Library, Users2, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const DashboardStats = () => {
  const { stats } = useMusicStore();

  const statsData: StatItem[] = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats?.totalSongs?.toString() ?? "0",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stats?.totalAlbums?.toString() ?? "0",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: stats?.totalArtists?.toString() ?? "0",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat: StatItem) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
