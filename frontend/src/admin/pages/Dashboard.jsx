import { useCallback, useEffect, useState } from "react";

import {
  Users,
  Eye,
  MessageSquare,
  Mail,
  ArrowUpRight,
  Activity,
  Clock3,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";

import api from "../../services/api";

const initialStats = {
  totalMessages: 0,
  newMessages: 0,
  unreadMessages: 0,
  sentEmails: 0,
  pendingEmails: 0,
  failedEmails: 0,
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [recentMessages, setRecentMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/dashboard/overview");

      const dashboardData = response.data.data;

      setStats({
        ...initialStats,
        ...dashboardData.stats,
      });

      setRecentMessages(dashboardData.recentMessages || []);
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: "Total Visitors",
      value: "—",
      description: "Awaiting analytics integration",
      icon: Users,
      type: "pending",
    },
    {
      title: "Page Views",
      value: "—",
      description: "Awaiting analytics integration",
      icon: Eye,
      type: "pending",
    },
    {
      title: "Total Messages",
      value: stats.totalMessages.toLocaleString(),
      description: "${stats.newMessages} new messages",
      icon: MessageSquare,
      type: "live",
    },
    {
      title: "Emails Delivered",
      value: stats.sentEmails.toLocaleString(),
      description:
        "${stats.pendingEmails} pending · ${stats.failedEmails} failed",
      icon: Mail,
      type: "live",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Header */}

      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">CONTROL CENTER</span>

          <h1>Dashboard Overview</h1>

          <p>Monitor and manage your portfolio from one place.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-date">
            <Clock3 size={17} />

            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <button
            type="button"
            className="dashboard-refresh"
            onClick={() => fetchDashboardData(true)}
            disabled={loading || refreshing}
            title="Refresh dashboard"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "refresh-spinning" : ""}
            />

            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* API Error */}

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={19} />

          <span>{error}</span>

          <button type="button" onClick={() => fetchDashboardData(true)}>
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}

      <div className="dashboard-stats">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              <h3>{stat.title}</h3>

              <div className="stat-value">
                {loading && stat.type === "live" ? "..." : stat.value}
              </div>

              <p>{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Message Statistics */}

      <div className="dashboard-mini-stats">
        <div className="mini-stat-item">
          <span>New Messages</span>
          <strong>{loading ? "..." : stats.newMessages}</strong>
        </div>

        <div className="mini-stat-item">
          <span>Unread Messages</span>
          <strong>{loading ? "..." : stats.unreadMessages}</strong>
        </div>

        <div className="mini-stat-item">
          <span>Pending Emails</span>
          <strong>{loading ? "..." : stats.pendingEmails}</strong>
        </div>

        <div className="mini-stat-item">
          <span>Failed Emails</span>
          <strong>{loading ? "..." : stats.failedEmails}</strong>
        </div>
      </div>

      {/* Main Dashboard Grid */}

      <div className="dashboard-main-grid">
        {/* Analytics Preview */}

        <section className="dashboard-panel analytics-preview">
          <div className="panel-heading">
            <div>
              <h2>Website Analytics</h2>
              <p>Traffic overview and visitor activity</p>
            </div>

            <Activity size={21} />
          </div>

          <div className="empty-state">
            <div className="empty-state-icon">
              <Activity size={28} />
            </div>

            <h3>Analytics System Coming Next</h3>

            <p>
              Your custom analytics engine will collect and display website
              traffic data here.
            </p>
          </div>
        </section>

        {/* System Status */}

        <section className="dashboard-panel system-panel">
          <div className="panel-heading">
            <div>
              <h2>System Status</h2>
              <p>Platform overview</p>
            </div>

            <ShieldCheck size={21} />
          </div>

          <div className="system-status-item">
            <span>Admin Authentication</span>
            <strong className="status-active">Protected</strong>
          </div>

          <div className="system-status-item">
            <span>Backend API</span>

            <strong className={error ? "status-pending" : "status-active"}>
              {loading ? "Checking..." : error ? "Unavailable" : "Connected"}
            </strong>
          </div>

          <div className="system-status-item">
            <span>Email Retry Worker</span>
            <strong className="status-configured">Configured</strong>
          </div>

          <div className="system-status-item">
            <span>Custom Analytics</span>
            <strong className="status-pending">Pending</strong>
          </div>
        </section>
      </div>

      {/* Recent Messages */}

      <section className="dashboard-panel recent-messages-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Messages</h2>
            <p>Latest submissions from your portfolio contact form</p>
          </div>

          <Inbox size={21} />
        </div>

        {loading ? (
          <div className="dashboard-table-state">
            <RefreshCw size={22} className="refresh-spinning" />
            <p>Loading recent messages...</p>
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="dashboard-table-state">
            <MessageSquare size={25} />
            <p>No messages received yet.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Project Type</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="message-sender">{message.full_name}</td>

                    <td>{message.subject}</td>

                    <td>{message.project_type}</td>

                    <td>
                      <span className={`table-badge status-${message.status}`}>
                        {message.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`table-badge email-${message.email_status}`}
                      >
                        {message.email_status || "unknown"}
                      </span>
                    </td>

                    <td className="message-date">
                      {formatDate(message.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Management Modules */}

      <section className="dashboard-panel quick-panel">
        <div className="panel-heading">
          <div>
            <h2>Management Modules</h2>
            <p>Your portfolio management workspace</p>
          </div>
        </div>

        <div className="module-grid">
          {[
            ["Analytics", "Website traffic and insights"],
            ["Messages", "Manage contact submissions"],
            ["Email Management", "Monitor email delivery"],
            ["Projects", "Manage portfolio projects"],
          ].map(([title, description]) => (
            <div className="module-item" key={title}>
              <div className="module-dot"></div>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
