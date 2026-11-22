import {
  Eye,
  ArrowUpDown,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const getDeviceIcon = (device) => {
  switch (device?.toLowerCase()) {
    case "desktop":
      return Monitor;
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Globe;
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString();
};

const VisitorsTable = ({
  visitors = [],
  loading = false,
  pagination = {},
  sort = "last_seen_at",
  order = "desc",
  onSort,
  onPageChange,
  onView,
}) => {
  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const total = pagination.total || 0;

  const columns = [
    { label: "Visitor", key: "visitor_id" },
    { label: "Device", key: "last_device" },
    { label: "Browser", key: "browser" },
    { label: "OS", key: "os" },
    { label: "Visits", key: "total_sessions" },
    { label: "Page Views", key: "total_page_views" },
    { label: "Last Visit", key: "last_seen_at" },
  ];

  return (
    <div className="visitors-table-container">
      <div className="visitors-table-header">
        <div>
          <h2>Visitors</h2>
          <p>Manage and explore website visitors</p>
        </div>

        <div className="visitors-total-badge">
          {total.toLocaleString()} Visitors
        </div>
      </div>

      <div className="visitors-table-scroll">
        <table className="visitors-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <button
                    type="button"
                    className="visitors-sort-button"
                    onClick={() => onSort?.(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ))}

              <th>Type</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="visitor-loading-row">
                  {Array.from({ length: 10 }).map((__, cell) => (
                    <td key={cell}>
                      <div className="visitor-table-skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : visitors.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="visitors-empty-state">
                    <Globe size={35} />
                    <h3>No visitors found</h3>
                    <p>No visitor records match your current filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => {
                const DeviceIcon = getDeviceIcon(visitor.last_device);

                return (
                  <tr key={visitor.id || visitor.visitor_id}>
                    <td>
                      <div className="visitor-identity">
                        <div className="visitor-avatar">
                          <Globe size={17} />
                        </div>

                        <div className="visitor-identity-info">
                          <span className="visitor-id">
                            {visitor.visitor_id
                              ? `${visitor.visitor_id.slice(0, 14)}...`
                              : "Unknown"}
                          </span>

                          <small>
                            {visitor.is_returning
                              ? "Returning visitor"
                              : "First-time visitor"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="visitor-device-cell">
                        <DeviceIcon size={17} />
                        <span>{visitor.last_device || "Unknown"}</span>
                      </div>
                    </td>

                    <td>{visitor.last_browser || "Unknown"}</td>

                    <td>{visitor.last_os || "Unknown"}</td>

                    <td>
                      <span className="visitor-number-badge">
                        {visitor.total_sessions ?? 0}
                      </span>
                    </td>

                    <td>{visitor.total_page_views ?? 0}</td>

                    <td>
                      <span className="visitor-date-cell">
                        {formatDate(visitor.last_seen_at)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`visitor-type-badge ${
                          visitor.is_returning ? "returning" : "new"
                        }`}
                      >
                        {visitor.is_returning ? "Returning" : "New"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="visitor-view-button"
                        onClick={() => onView?.(visitor)}
                        title="View visitor details"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="visitors-pagination">
        <span className="visitors-pagination-info">
          Page {currentPage} of {totalPages}
          {" · "}
          {total} total visitors
        </span>

        <div className="visitors-pagination-controls">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          <span className="visitors-current-page">{currentPage}</span>

          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitorsTable;
