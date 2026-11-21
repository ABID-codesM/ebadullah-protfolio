import { Search, Filter, RotateCcw } from "lucide-react";

const VisitorsFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="visitors-filters">
      {/* Search */}
      <div className="visitors-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search visitor ID..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      {/* Visitor Type */}
      <div className="visitor-filter-field">
        <Filter size={16} />

        <select
          value={filters.visitorType}
          onChange={(e) => onFilterChange("visitorType", e.target.value)}
        >
          <option value="">All Visitors</option>
          <option value="new">New Visitors</option>
          <option value="returning">Returning Visitors</option>
        </select>
      </div>

      {/* Device */}
      <div className="visitor-filter-field">
        <select
          value={filters.device}
          onChange={(e) => onFilterChange("device", e.target.value)}
        >
          <option value="">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Browser */}
      <div className="visitor-filter-field">
        <input
          type="text"
          placeholder="Browser (e.g. Chrome)"
          value={filters.browser}
          onChange={(e) => onFilterChange("browser", e.target.value)}
        />
      </div>

      {/* Operating System */}
      <div className="visitor-filter-field">
        <input
          type="text"
          placeholder="OS (e.g. Windows)"
          value={filters.os}
          onChange={(e) => onFilterChange("os", e.target.value)}
        />
      </div>

      {/* Start Date */}
      <div className="visitor-filter-date">
        <label>From</label>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
        />
      </div>

      {/* End Date */}
      <div className="visitor-filter-date">
        <label>To</label>

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        className="visitors-filter-reset"
        onClick={onReset}
        title="Reset all filters"
      >
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default VisitorsFilters;
