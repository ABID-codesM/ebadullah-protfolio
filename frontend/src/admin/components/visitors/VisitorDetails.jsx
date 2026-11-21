import {
  X,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  Eye,
  Activity,
  Calendar,
  MapPin,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString();
};

const VisitorDetails = ({ visitor, details, loading = false, onClose }) => {
  if (!visitor) return null;

  const visitorData = details?.visitor || visitor;
  const sessions = details?.sessions || [];
  const pageViews = details?.pageViews || [];
  const events = details?.events || [];

  const deviceIcons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
  };

  const DeviceIcon =
    deviceIcons[visitorData.device_type?.toLowerCase()] || Globe;

  return (
    <div className="visitor-details-overlay" onClick={onClose}>
      <aside
        className="visitor-details-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="visitor-details-header">
          <div>
            <span className="visitor-details-label">VISITOR PROFILE</span>
            <h2>Visitor Details</h2>
          </div>

          <button
            type="button"
            className="visitor-details-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Identity */}
        <div className="visitor-details-profile">
          <div className="visitor-details-avatar">
            <Globe size={26} />
          </div>

          <h3>{visitorData.visitor_id || "Unknown Visitor"}</h3>

          <span
            className={`visitor-type-badge ${
              visitorData.is_returning ? "returning" : "new"
            }`}
          >
            {visitorData.is_returning ? "Returning Visitor" : "New Visitor"}
          </span>
        </div>

        {/* Stats */}
        <div className="visitor-details-stats">
          <div>
            <Activity size={18} />
            <span>Sessions</span>
            <strong>{visitorData.total_sessions ?? 0}</strong>
          </div>

          <div>
            <Eye size={18} />
            <span>Page Views</span>
            <strong>{visitorData.total_page_views ?? 0}</strong>
          </div>
        </div>

        {/* Information */}
        <section className="visitor-details-section">
          <h4>Device Information</h4>

          <div className="visitor-details-info-row">
            <DeviceIcon size={18} />
            <span>Device</span>
            <strong>{visitorData.device_type || "Unknown"}</strong>
          </div>

          <div className="visitor-details-info-row">
            <Globe size={18} />
            <span>Browser</span>
            <strong>{visitorData.browser || "Unknown"}</strong>
          </div>

          <div className="visitor-details-info-row">
            <Monitor size={18} />
            <span>Operating System</span>
            <strong>{visitorData.os || "Unknown"}</strong>
          </div>

          <div className="visitor-details-info-row">
            <MapPin size={18} />
            <span>Country</span>
            <strong>{visitorData.country || "Unknown"}</strong>
          </div>
        </section>

        {/* Dates */}
        <section className="visitor-details-section">
          <h4>Activity Timeline</h4>

          <div className="visitor-details-info-row">
            <Calendar size={18} />
            <span>First Visit</span>
            <strong>{formatDate(visitorData.first_seen_at)}</strong>
          </div>

          <div className="visitor-details-info-row">
            <Clock size={18} />
            <span>Last Visit</span>
            <strong>{formatDate(visitorData.last_seen_at)}</strong>
          </div>
        </section>

        {/* Sessions */}
        <section className="visitor-details-section">
          <h4>Recent Sessions ({sessions.length})</h4>

          {loading ? (
            <div className="visitor-details-loading">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <p className="visitor-details-empty">No sessions available.</p>
          ) : (
            <div className="visitor-details-list">
              {sessions.slice(0, 10).map((session, index) => (
                <div
                  className="visitor-details-list-item"
                  key={session.id || index}
                >
                  <div>
                    <strong>Session {index + 1}</strong>
                    <small>
                      {formatDate(session.started_at || session.created_at)}
                    </small>
                  </div>

                  <span className="visitor-details-item-count">
                    {session.page_views_count ?? 0} Pages
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Page Views */}
        <section className="visitor-details-section">
          <h4>Recent Page Views ({pageViews.length})</h4>

          {pageViews.length === 0 ? (
            <p className="visitor-details-empty">No page views available.</p>
          ) : (
            <div className="visitor-details-list">
              {pageViews.slice(0, 15).map((page, index) => (
                <div
                  className="visitor-details-list-item"
                  key={page.id || index}
                >
                  <div>
                    <strong>
                      {page.page_title || page.page_path || "Page"}
                    </strong>

                    <small>{page.page_path || ""}</small>

                    <small>
                      {formatDate(page.visited_at || page.created_at)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Events */}
        <section className="visitor-details-section">
          <h4>Recent Events ({events.length})</h4>

          {events.length === 0 ? (
            <p className="visitor-details-empty">No events recorded.</p>
          ) : (
            <div className="visitor-details-list">
              {events.slice(0, 15).map((event, index) => (
                <div
                  className="visitor-details-list-item"
                  key={event.id || index}
                >
                  <div>
                    <strong>
                      {event.event_name || event.event_type || "Event"}
                    </strong>

                    <small>
                      {formatDate(event.created_at || event.occurred_at)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  );
};

export default VisitorDetails;
