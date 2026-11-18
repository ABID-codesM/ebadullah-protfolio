import { useLocation } from "react-router-dom";

const sectionNames = {
  analytics: "Analytics",
  visitors: "Visitors",
  messages: "Messages",
  emails: "Email Management",
  projects: "Projects",
  skills: "Skills",
  profile: "Profile Settings",
  settings: "Admin Settings",
  activity: "Activity Logs",
};

const AdminSection = () => {
  const location = useLocation();

  const section = location.pathname.split("/").pop();

  const title = sectionNames[section] || "Management";

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">ADMINISTRATION</span>

          <h1>{title}</h1>

          <p>This module is part of your custom portfolio management system.</p>
        </div>
      </div>

      <section className="dashboard-panel coming-soon-panel">
        <div className="empty-state">
          <h2>{title} Module</h2>

          <p>
            This module will be implemented and connected to the backend in the
            upcoming development phase.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminSection;
