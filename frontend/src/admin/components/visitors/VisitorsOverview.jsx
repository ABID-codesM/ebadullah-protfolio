import { Users, Activity, Eye, UserPlus, Repeat2, Radio } from "lucide-react";

import VisitorStatsCard from "./VisitorStatsCard";

const VisitorsOverview = ({ data, loading }) => {
  const stats = [
    {
      title: "Total Visitors",
      value: data?.total_visitors,
      description: "Unique visitors recorded",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Sessions",
      value: data?.total_sessions,
      description: "All recorded sessions",
      icon: Activity,
      color: "purple",
    },
    {
      title: "Page Views",
      value: data?.total_page_views,
      description: "Total pages viewed",
      icon: Eye,
      color: "cyan",
    },
    {
      title: "New Visitors Today",
      value: data?.new_visitors_today,
      description: "First visit today",
      icon: UserPlus,
      color: "green",
    },
    {
      title: "Returning Visitors",
      value: data?.returning_visitors,
      description: "Visitors with multiple sessions",
      icon: Repeat2,
      color: "orange",
    },
    {
      title: "Active Visitors",
      value: data?.active_visitors,
      description: "Active within the last 5 minutes",
      icon: Radio,
      color: "red",
    },
  ];

  return (
    <section className="visitors-overview">
      <div className="visitors-overview-header">
        <div>
          <h2>Visitors Overview</h2>
          <p>Website traffic and visitor activity at a glance.</p>
        </div>
      </div>

      <div className="visitor-stats-grid">
        {stats.map((stat) => (
          <VisitorStatsCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>
    </section>
  );
};

export default VisitorsOverview;
