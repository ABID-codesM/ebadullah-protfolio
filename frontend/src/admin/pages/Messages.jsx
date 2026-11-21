import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import "../styles/admin.css";

const folders = [
  { id: "all", label: "All Messages", icon: "▤" },
  { id: "inbox", label: "Inbox", icon: "✉" },
  { id: "unread", label: "Unread", icon: "●" },
  { id: "read", label: "Read", icon: "✓" },
  { id: "replied", label: "Replied", icon: "↩" },
  { id: "archived", label: "Archived", icon: "▣" },
  { id: "trash", label: "Trash", icon: "⌫" },
];

const projectTypes = [
  "Full-Stack Web Application",
  "Frontend Development",
  "Backend Development",
  "Business Management System",
  "API Development",
  "Other",
];

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const getMessageList = (response) => {
  const data = response?.data?.data;

  if (Array.isArray(data)) return data;

  return data?.messages || data?.items || response?.data?.messages || [];
};

const getPagination = (response, currentPage, limit) => {
  const data = response?.data?.data;

  return {
    total: Number(data?.total ?? response?.data?.total ?? 0),
    totalPages: Number(data?.totalPages ?? response?.data?.totalPages ?? 1),
    page: Number(data?.page ?? currentPage),
    limit: Number(data?.limit ?? limit),
  };
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "unknown").toLowerCase();

  return (
    <span className={`messages-badge badge-${normalized}`}>
      {normalized.replaceAll("_", " ")}
    </span>
  );
};

const Messages = () => {
  // Main data
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [folder, setFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [projectType, setProjectType] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Selected message
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Replies
  const [replies, setReplies] = useState([]);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const [notice, setNotice] = useState("");

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        folder,
        search: search.trim() || undefined,
        status: status || undefined,
        projectType: projectType || undefined,
        emailStatus: emailStatus || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit,
      };

      const response = await api.get("/messages", { params });

      setMessages(getMessageList(response));
      setPagination(getPagination(response, page, limit));
      setSelectedIds([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [
    folder,
    search,
    status,
    projectType,
    emailStatus,
    dateFrom,
    dateTo,
    page,
    limit,
  ]);

  useEffect(() => {
    const timer = setTimeout(fetchMessages, 350);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

  // Open message details
  const openMessage = async (message) => {
    try {
      setSelectedMessage(message);
      setDetailsLoading(true);
      setReplies([]);
      setReplyError("");

      const [messageResponse, repliesResponse] = await Promise.all([
        api.get(`/messages/${message.id}`),
        api.get(`/replies/${message.id}`),
      ]);

      const detail =
        messageResponse.data?.data?.message ||
        messageResponse.data?.data ||
        message;

      setSelectedMessage(detail);

      const replyData = repliesResponse.data?.data;
      setReplies(Array.isArray(replyData) ? replyData : []);

      // Mark unread messages as read
      if (!detail.is_Read) {
        await api.patch(`/messages/${message.id}/read`, {
          is_Read: true,
        });

        setSelectedMessage((previous) => ({
          ...previous,
          is_Read: true,
        }));

        fetchMessages();
      }

      setReplySubject(
        detail.subject?.toLowerCase().startsWith("re:")
          ? detail.subject
          : `Re: ${detail.subject || ""}`,
      );
    } catch (err) {
      setReplyError(getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedMessage(null);
    setReplies([]);
    setReplySubject("");
    setReplyMessage("");
    setReplyError("");
  };

  // Send reply
  const handleSendReply = async (event) => {
    event.preventDefault();

    if (!selectedMessage || sendingReply) return;

    try {
      setSendingReply(true);
      setReplyError("");

      const response = await api.post(`/replies/${selectedMessage.id}`, {
        subject: replySubject,
        message: replyMessage,
      });

      const newReply = response.data?.data;

      if (newReply) {
        setReplies((previous) => [...previous, newReply]);
      }

      setReplyMessage("");
      setNotice(response.data?.message || "Reply queued successfully.");

      fetchMessages();
    } catch (err) {
      setReplyError(getErrorMessage(err));
    } finally {
      setSendingReply(false);
    }
  };

  // Single message actions
  const handleSingleAction = async (action, messageId) => {
    try {
      setActionLoading(true);
      setError("");

      const endpoints = {
        archive: () => api.patch(`/messages/${messageId}/archive`),

        restore_archive: () =>
          api.patch(`/messages/${messageId}/restore-archive`),

        trash: () => api.delete(`/messages/${messageId}`),

        restore_trash: () => api.patch(`/messages/${messageId}/restore-trash`),

        mark_read: () =>
          api.patch(`/messages/${messageId}/read`, {
            is_Read: true,
          }),

        mark_unread: () =>
          api.patch(`/messages/${messageId}/read`, {
            is_Read: false,
          }),
      };

      if (!endpoints[action]) return;

      await endpoints[action]();

      setNotice("Message updated successfully.");

      closeDetails();
      await fetchMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk selection
  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = messages.map((message) => message.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds(allSelected ? [] : visibleIds);
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (!selectedIds.length || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");

      await api.patch("/messages/bulk", {
        ids: selectedIds,
        action,
      });

      setNotice("Bulk action completed successfully.");

      setSelectedIds([]);
      await fetchMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setProjectType("");
    setEmailStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const changeFolder = (newFolder) => {
    setFolder(newFolder);
    setPage(1);
    setSelectedIds([]);
  };

  const showNotice = Boolean(notice);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <div className="dashboard-page messages-page">
      {/* Header */}
      <div className="dashboard-welcome messages-header">
        <div>
          <span className="dashboard-eyebrow">COMMUNICATION CENTER</span>

          <h1>Messages</h1>

          <p>
            Manage contact messages, communicate with visitors and track email
            delivery.
          </p>
        </div>

        <button
          type="button"
          className="messages-refresh-btn"
          onClick={fetchMessages}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="messages-alert error-alert">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {showNotice && (
        <div className="messages-alert success-alert">{notice}</div>
      )}

      {/* Folder Navigation */}
      <div className="messages-folder-panel">
        <div className="messages-folder-list">
          {folders.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`messages-folder-btn ${
                folder === item.id ? "active" : ""
              }`}
              onClick={() => changeFolder(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="messages-summary-grid">
        <div className="messages-summary-card">
          <span>Total Results</span>
          <strong>{pagination.total}</strong>
          <small>Matching messages</small>
        </div>

        <div className="messages-summary-card">
          <span>Current Page</span>
          <strong>{pagination.page}</strong>
          <small>Of {pagination.totalPages} pages</small>
        </div>

        <div className="messages-summary-card">
          <span>Selected</span>
          <strong>{selectedIds.length}</strong>
          <small>Selected messages</small>
        </div>
      </div>

      {/* Main Panel */}
      <section className="dashboard-panel messages-main-panel">
        <div className="messages-panel-heading">
          <div>
            <h2>{folders.find((item) => item.id === folder)?.label}</h2>
            <p>{pagination.total} messages found</p>
          </div>
        </div>

        {/* Search */}
        <div className="messages-search-row">
          <div className="messages-search-box">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search name, email, subject or message..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="messages-filters">
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={projectType}
            onChange={(event) => {
              setProjectType(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Project Types</option>

            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={emailStatus}
            onChange={(event) => {
              setEmailStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Email States</option>
            <option value="unknown">Unknown</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            aria-label="From date"
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPage(1);
            }}
          />

          <input
            type="date"
            value={dateTo}
            aria-label="To date"
            onChange={(event) => {
              setDateTo(event.target.value);
              setPage(1);
            }}
          />

          <button
            type="button"
            className="messages-reset-btn"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="messages-bulk-toolbar">
            <strong>{selectedIds.length} selected</strong>

            {folder === "trash" ? (
              <button
                onClick={() => handleBulkAction("restore_trash")}
                disabled={actionLoading}
              >
                Restore
              </button>
            ) : folder === "archived" ? (
              <button
                onClick={() => handleBulkAction("restore_archive")}
                disabled={actionLoading}
              >
                Restore Archive
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleBulkAction("mark_read")}
                  disabled={actionLoading}
                >
                  Mark Read
                </button>

                <button
                  onClick={() => handleBulkAction("mark_unread")}
                  disabled={actionLoading}
                >
                  Mark Unread
                </button>

                <button
                  onClick={() => handleBulkAction("archive")}
                  disabled={actionLoading}
                >
                  Archive
                </button>

                <button
                  className="danger-action"
                  onClick={() => handleBulkAction("trash")}
                  disabled={actionLoading}
                >
                  Move to Trash
                </button>
              </>
            )}
          </div>
        )}

        {/* Table */}
        <div className="messages-table-wrapper">
          {loading ? (
            <div className="messages-loading">
              <div className="messages-spinner" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="messages-empty">
              <span>✉</span>
              <h3>No messages found</h3>
              <p>There are no messages matching your current filters.</p>
            </div>
          ) : (
            <table className="messages-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        messages.length > 0 &&
                        messages.every((message) =>
                          selectedIds.includes(message.id),
                        )
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th>Visitor</th>
                  <th>Subject</th>
                  <th>Project Type</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className={!message.is_Read ? "unread-row" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(message.id)}
                        onChange={() => toggleSelection(message.id)}
                      />
                    </td>

                    <td>
                      <div className="messages-visitor-cell">
                        <strong>{message.full_name}</strong>
                        <span>{message.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="messages-subject-cell">
                        {!message.is_Read && (
                          <span className="messages-unread-dot" />
                        )}
                        {message.subject}
                      </div>
                    </td>

                    <td>{message.project_type}</td>

                    <td>
                      <StatusBadge status={message.status} />
                    </td>

                    <td>
                      <StatusBadge status={message.email_status} />
                    </td>

                    <td>{formatDate(message.created_at)}</td>

                    <td>
                      <button
                        type="button"
                        className="messages-view-btn"
                        onClick={() => openMessage(message)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && messages.length > 0 && (
          <div className="messages-pagination">
            <div>
              <span>Rows per page:</span>

              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="messages-page-controls">
              <span>
                Page {page} of {pagination.totalPages}
              </span>

              <button
                disabled={page <= 1}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Previous
              </button>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Message Details Drawer */}
      {selectedMessage && (
        <div
          className="messages-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <div className="messages-details-drawer">
            <div className="messages-details-header">
              <div>
                <span>MESSAGE DETAILS</span>
                <h2>Message #{selectedMessage.id}</h2>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                aria-label="Close message details"
              >
                ×
              </button>
            </div>

            {detailsLoading ? (
              <div className="messages-loading">
                <div className="messages-spinner" />
                <p>Loading message details...</p>
              </div>
            ) : (
              <div className="messages-details-content">
                <div className="messages-details-card">
                  <h3>Visitor Information</h3>

                  <div className="messages-info-grid">
                    <div>
                      <span>Name</span>
                      <strong>{selectedMessage.full_name}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{selectedMessage.email}</strong>
                    </div>

                    <div>
                      <span>Project Type</span>
                      <strong>{selectedMessage.project_type}</strong>
                    </div>

                    <div>
                      <span>Received</span>
                      <strong>{formatDate(selectedMessage.created_at)}</strong>
                    </div>
                  </div>
                </div>

                <div className="messages-details-card">
                  <h3>Message</h3>

                  <h4>{selectedMessage.subject}</h4>

                  <p className="messages-original-message">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="messages-details-card">
                  <h3>Message Status</h3>

                  <div className="messages-status-row">
                    <span>Message</span>
                    <StatusBadge status={selectedMessage.status} />
                  </div>

                  <div className="messages-status-row">
                    <span>Notification Email</span>
                    <StatusBadge status={selectedMessage.email_status} />
                  </div>
                </div>

                {/* Reply History */}
                <div className="messages-details-card">
                  <h3>Reply History</h3>

                  {replies.length === 0 ? (
                    <p className="messages-muted">
                      No replies have been sent yet.
                    </p>
                  ) : (
                    <div className="messages-reply-history">
                      {replies.map((reply) => (
                        <div className="messages-reply-item" key={reply.id}>
                          <div className="messages-reply-heading">
                            <strong>
                              {reply.admin_name || "Administrator"}
                            </strong>

                            <StatusBadge status={reply.email_status} />
                          </div>

                          <h4>{reply.subject}</h4>

                          <p>{reply.message}</p>

                          <small>
                            {formatDate(reply.created_at)}
                            {" · "}
                            {reply.email_attempts} attempts
                          </small>

                          {reply.email_last_error && (
                            <p className="messages-reply-error">
                              {reply.email_last_error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                {selectedMessage.deleted_at == null &&
                  selectedMessage.status !== "archived" &&
                  folder !== "trash" && (
                    <div className="messages-details-card">
                      <h3>Write a Reply</h3>

                      <form
                        className="messages-reply-form"
                        onSubmit={handleSendReply}
                      >
                        <label>
                          Recipient
                          <input
                            type="email"
                            value={selectedMessage.email}
                            readOnly
                          />
                        </label>

                        <label>
                          Subject
                          <input
                            type="text"
                            value={replySubject}
                            onChange={(event) =>
                              setReplySubject(event.target.value)
                            }
                            maxLength={200}
                            required
                          />
                        </label>

                        <label>
                          Your Reply
                          <textarea
                            rows="7"
                            value={replyMessage}
                            onChange={(event) =>
                              setReplyMessage(event.target.value)
                            }
                            maxLength={10000}
                            placeholder="Write your response..."
                            required
                          />
                        </label>

                        {replyError && (
                          <div className="messages-alert error-alert">
                            {replyError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="messages-send-btn"
                          disabled={
                            sendingReply ||
                            !replySubject.trim() ||
                            !replyMessage.trim()
                          }
                        >
                          {sendingReply ? "Sending..." : "↗ Send Reply"}
                        </button>
                      </form>
                    </div>
                  )}

                {/* Actions */}
                <div className="messages-details-actions">
                  {folder === "trash" ? (
                    <button
                      onClick={() =>
                        handleSingleAction("restore_trash", selectedMessage.id)
                      }
                      disabled={actionLoading}
                    >
                      Restore Message
                    </button>
                  ) : folder === "archived" ? (
                    <button
                      onClick={() =>
                        handleSingleAction(
                          "restore_archive",
                          selectedMessage.id,
                        )
                      }
                      disabled={actionLoading}
                    >
                      Restore from Archive
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleSingleAction(
                            selectedMessage.is_Read
                              ? "mark_unread"
                              : "mark_read",
                            selectedMessage.id,
                          )
                        }
                        disabled={actionLoading}
                      >
                        Mark as {selectedMessage.is_Read ? "Unread" : "Read"}
                      </button>

                      <button
                        onClick={() =>
                          handleSingleAction("archive", selectedMessage.id)
                        }
                        disabled={actionLoading}
                      >
                        Archive
                      </button>

                      <button
                        className="danger-action"
                        onClick={() => {
                          if (window.confirm("Move this message to Trash?")) {
                            handleSingleAction("trash", selectedMessage.id);
                          }
                        }}
                        disabled={actionLoading}
                      >
                        Move to Trash
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
