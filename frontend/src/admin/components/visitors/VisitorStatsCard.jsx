import { ArrowUpRight } from "lucide-react";

const VisitorStatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}) => {
  const formattedValue = Number(value || 0).toLocaleString("en-US");

  return (
    <div className={`visitor-stat-card visitor-stat-${color}`}>
      <div className="visitor-stat-header">
        <div className="visitor-stat-icon">
          {Icon && <Icon size={21} strokeWidth={2} />}
        </div>

        <span className="visitor-stat-indicator">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="visitor-stat-content">
        <h3>{title}</h3>

        <div className="visitor-stat-value">{formattedValue}</div>

        {description && (
          <p className="visitor-stat-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default VisitorStatsCard;
