import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import "../styles/admin.css";

const initialStats = {
  total: 0,
  sent: 0,
  pending: 0,
  failed: 0,
  unknown: 0,
};

const statusConfig = {
  sent: { label: "Sent", className: "success" },
  pending: { label: "Pending", className: "warning" },
  failed: { label: "Failed", className: "danger" },
  unknown: { label: "Unknown", className: "muted" },
};

const typeLabels = {
  contact_notification: "Contact Notification",
  admin_reply: "Admin Reply",
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString();
};

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return `${text.replace(/"/g, '""')}`;
};

export default function EmailManagement() {
  const [stats, setStats] = useState(initialStats);
  const [emails, setEmails] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingId, setRetryingId] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const response = await api.get("/emails/stats");

      if (response.data?.success) {
        setStats({
          ...initialStats,
          ...response.data.data,
        });
      }
    } catch (err) {
      console.error("Email stats error:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchEmails = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: pagination.limit,
        };

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });

        const response = await api.get("/emails", { params });

        if (!response.data?.success) {
          throw new Error("Unable to load email records.");
        }

        const data = response.data.data;

        setEmails(data.emails || []);
        setPagination((previous) => ({
          ...previous,
          ...(data.pagination || {}),
        }));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load emails.",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchEmails(1);
  }, [fetchEmails]);

  const handleRetry = async (email) => {
    const key = "${email.email_type}-${email.id}";

    try {
      setRetryingId(key);

      if (email.email_type === "contact_notification") {
        await api.post(`/emails/contact/${email.id}/retry`);
      } else {
        await api.post(`/emails/replies/${email.id}/retry`);
      }

      await Promise.all([fetchEmails(pagination.page), fetchStats()]);

      setSelectedEmail(null);
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Unable to retry this email.",
      );
    } finally {
      setRetryingId(null);
    }
  };

  const exportCsv = () => {
    if (!emails.length) return;

    const headers = [
      "ID",
      "Type",
      "Visitor Name",
      "Visitor Email",
      "Recipient",
      "Subject",
      "Status",
      "Attempts",
      "Created At",
      "Sent At",
      "Last Error",
    ];

    const rows = emails.map((email) => [
      email.id,
      typeLabels[email.email_type] || email.email_type,
      email.visitor_name,
      email.visitor_email,
      email.recipient_email,
      email.subject,
      email.email_status,
      email.email_attempts,
      email.created_at,
      email.email_sent_at,
      email.email_last_error,
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `email-management-page-${pagination.page}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      type: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const statCards = [
    { label: "Total Emails", value: stats.total, key: "total" },
    { label: "Sent", value: stats.sent, key: "sent" },
    { label: "Pending", value: stats.pending, key: "pending" },
    { label: "Failed", value: stats.failed, key: "failed" },
    { label: "Unknown", value: stats.unknown, key: "unknown" },
  ];

  return (
    <div className="admin-page email-management-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">COMMUNICATION CENTER</span>
          <h1>Email Management</h1>
          <p>
            Monitor email delivery, review email history and retry unsuccessful
            deliveries.
          </p>
        </div>

        <div className="email-header-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={exportCsv}
            disabled={!emails.length}
          >
            Export Current Page
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => {
              fetchStats();
              fetchEmails(pagination.page);
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <section className="email-stats-grid">
        {statCards.map((stat) => (
          <div className="email-stat-card" key={stat.key}>
            <span>{stat.label}</span>
            <strong>{statsLoading ? "—" : stat.value}</strong>
          </div>
        ))}
      </section>

      <section className="email-filter-panel">
        <div className="email-search-field">
          <label htmlFor="email-search">Search Emails</label>
          <input
            id="email-search"
            name="search"
            type="search"
            placeholder="Search name, email or subject..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label htmlFor="email-status">Delivery Status</label>
          <select
            id="email-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label htmlFor="email-type">Email Type</label>
          <select
            id="email-type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="contact_notification">Contact Notification</option>
            <option value="admin_reply">Admin Reply</option>
          </select>
        </div>

        <div>
          <label htmlFor="email-date-from">From Date</label>
          <input
            id="email-date-from"
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label htmlFor="email-date-to">To Date</label>
          <input
            id="email-date-to"
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </section>

      <section className="email-table-section">
        <div className="email-table-header">
          <div>
            <h2>Email History</h2>
            <span>{pagination.total} email records found</span>
          </div>
        </div>

        {error && <div className="email-error-message">{error}</div>}

        <div className="email-table-wrapper">
          <table className="email-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Type</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="email-empty-state">
                    Loading email records...
                  </td>
                </tr>
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan="7" className="email-empty-state">
                    No email records found.
                  </td>
                </tr>
              ) : (
                emails.map((email) => {
                  const status =
                    statusConfig[email.email_status] || statusConfig.unknown;

                  return (
                    <tr key={`${email.email_type}-${email.id}`}>
                      <td>
                        <div className="email-primary-cell">
                          <strong>{email.subject}</strong>
                          <span>{email.visitor_name}</span>
                          <small>{email.visitor_email}</small>
                        </div>
                      </td>

                      <td>
                        <span className="email-type-badge">
                          {typeLabels[email.email_type] || email.email_type}
                        </span>
                      </td>

                      <td>{email.recipient_email}</td>

                      <td>
                        <span
                          className={`email-status-badge ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td>{email.email_attempts}</td>

                      <td>{formatDate(email.created_at)}</td>

                      <td>
                        <button
                          type="button"
                          className="email-view-btn"
                          onClick={() => setSelectedEmail(email)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="email-pagination">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <div>
            <button
              type="button"
              disabled={loading || pagination.page <= 1}
              onClick={() => fetchEmails(pagination.page - 1)}
            >
              Previous
            </button>

            <button
              type="button"
              disabled={loading || pagination.page >= pagination.totalPages}
              onClick={() => fetchEmails(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedEmail && (
        <div
          className="email-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEmail(null);
            }
          }}
        >
          <div
            className="email-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-details-title"
          >
            <div className="email-modal-header">
              <div>
                <span className="admin-eyebrow">EMAIL RECORD</span>
                <h2 id="email-details-title">Email Details</h2>
              </div>

              <button
                type="button"
                className="email-modal-close"
                onClick={() => setSelectedEmail(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="email-details-content">
              <div>
                <span>Subject</span>
                <strong>{selectedEmail.subject}</strong>
              </div>

              <div>
                <span>Email Type</span>
                <strong>
                  {typeLabels[selectedEmail.email_type] ||
                    selectedEmail.email_type}
                </strong>
              </div>

              <div>
                <span>Visitor</span>
                <strong>{selectedEmail.visitor_name}</strong>
              </div>

              <div>
                <span>Visitor Email</span>
                <strong>{selectedEmail.visitor_email}</strong>
              </div>

              <div>
                <span>Recipient</span>
                <strong>{selectedEmail.recipient_email}</strong>
              </div>

              <div>
                <span>Delivery Status</span>
                <strong>
                  {statusConfig[selectedEmail.email_status]?.label || "Unknown"}
                </strong>
              </div>

              <div>
                <span>Attempts</span>
                <strong>{selectedEmail.email_attempts}</strong>
              </div>

              <div>
                <span>Created At</span>
                <strong>{formatDate(selectedEmail.created_at)}</strong>
              </div>

              <div>
                <span>Sent At</span>
                <strong>{formatDate(selectedEmail.email_sent_at)}</strong>
              </div>

              <div>
                <span>Last Updated By</span>
                <strong>
                  {selectedEmail.admin_name || "System / Contact Form"}
                </strong>
              </div>

              {selectedEmail.email_last_error && (
                <div className="email-error-details">
                  <span>Last Delivery Error</span>
                  <pre>{selectedEmail.email_last_error}</pre>
                </div>
              )}
            </div>

            <div className="email-modal-footer">
              {selectedEmail.email_status === "failed" && (
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={
                    retryingId ===
                    `${selectedEmail.email_type}-${selectedEmail.id}`
                  }
                  onClick={() => handleRetry(selectedEmail)}
                >
                  {retryingId ===
                  `${selectedEmail.email_type}-${selectedEmail.id}`
                    ? "Retrying..."
                    : "Retry Email"}
                </button>
              )}

              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedEmail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
