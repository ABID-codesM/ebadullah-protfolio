import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowUpRight,
  ExternalLink,
  X,
  Layers3,
  Code2,
  Database,
  Wallet,
  Gamepad2,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import "./Projects.css";

const projects = [
  {
    id: 1,
    number: "01",
    title: "Building Management System",
    shortTitle: "Building Management",
    category: "Full-Stack",
    type: "Full-Stack Web Application",
    description:
      "A centralized property management platform designed to digitize building operations, tenant records, rental contracts, and payment management.",
    challenge:
      "Traditional paper-based property management can lead to fragmented records, calculation errors, and difficulties managing multiple buildings.",
    solution:
      "Developed a centralized web application with dedicated modules for managing buildings, employees, tenants, rentals, and tenant payments.",
    features: [
      "Building and employee management",
      "Tenant and rental management",
      "Rental contract management",
      "Tenant payment tracking",
      "Utility cost calculation",
      "Authentication with JWT",
    ],
    technologies: [
      "React",
      "JavaScript",
      "Vite",
      "CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "JWT",
    ],
    demo: "https://ABID-codesM.github.io/BMS-Fullstack",
    featured: true,
    icon: LayoutDashboard,
    theme: "bms",
    status: "Completed",
  },
  {
    id: 2,
    number: "02",
    title: "Budget Tracker System",
    shortTitle: "Budget Tracker",
    category: "Frontend",
    type: "Personal Finance Web Application",
    description:
      "A responsive budget tracking application that helps users organize and monitor their income and expenses.",
    challenge:
      "Keeping track of personal income and expenses can become difficult without a simple and organized system.",
    solution:
      "Built a browser-based application that allows users to manage their budget and preserve their data using LocalStorage.",
    features: [
      "Income and expense tracking",
      "Budget organization",
      "Persistent browser storage",
      "Responsive user interface",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    demo: "https://ABID-codesM.github.io/budget-tracker-system",
    featured: false,
    icon: Wallet,
    theme: "budget",
    status: "Completed",
  },
  {
    id: 3,
    number: "03",
    title: "Number Guessing Game",
    shortTitle: "Number Guessing",
    category: "Frontend",
    type: "Interactive Web Game",
    description:
      "An interactive number guessing game featuring multiple difficulty levels, limited attempts, and score tracking.",
    challenge:
      "Creating a simple but engaging game experience with clear feedback and different levels of difficulty.",
    solution:
      "Developed an interactive game using JavaScript with difficulty settings, attempt tracking, hints, and score functionality.",
    features: [
      "Easy, Medium, and Hard modes",
      "Limited guessing attempts",
      "Hints and feedback",
      "Score tracking",
      "Game restart functionality",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    demo: null,
    featured: false,
    icon: Gamepad2,
    theme: "game",
    status: "Completed",
  },
];

const filters = ["All Projects", "Full-Stack", "Frontend"];

function ProjectPreview({ theme }) {
  if (theme === "bms") {
    return (
      <div className="project-preview bms-preview">
        <div className="preview-sidebar">
          <span className="preview-logo">B.</span>
          <span className="preview-line active" />
          <span className="preview-line" />
          <span className="preview-line" />
          <span className="preview-line" />
        </div>

        <div className="preview-main">
          <div className="preview-topbar">
            <span>Dashboard</span>
            <span className="preview-avatar">EA</span>
          </div>

          <div className="preview-welcome">
            <span>Overview</span>
            <span className="preview-dot" />
          </div>

          <div className="preview-stats">
            <div>
              <span>Buildings</span>
              <strong>08</strong>
            </div>
            <div>
              <span>Tenants</span>
              <strong>24</strong>
            </div>
            <div>
              <span>Rentals</span>
              <strong>16</strong>
            </div>
          </div>

          <div className="preview-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (theme === "budget") {
    return (
      <div className="project-preview budget-preview">
        <div className="budget-header">
          <span>My Budget</span>
          <Wallet size={18} />
        </div>

        <div className="budget-balance">
          <span>Total Balance</span>
          <strong>$2,450.00</strong>
        </div>

        <div className="budget-cards">
          <div>
            <span>Income</span>
            <strong>+$3,200</strong>
          </div>
          <div>
            <span>Expenses</span>
            <strong>-$750</strong>
          </div>
        </div>

        <div className="budget-transactions">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="project-preview game-preview">
      <div className="game-window">
        <div className="game-stars">✦ &nbsp; ✧ &nbsp; ✦</div>

        <span className="game-label">NUMBER CHALLENGE</span>

        <strong className="game-number">?</strong>

        <div className="game-input">
          <span>Enter your guess...</span>
          <ArrowUpRight size={15} />
        </div>

        <div className="game-levels">
          <span>Easy</span>
          <span>Medium</span>
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const Icon = project.icon;

  return (
    <motion.div
      className="project-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} />
        </button>

        <div className="modal-heading">
          <div className="modal-icon">
            <Icon size={25} />
          </div>

          <div>
            <span className="project-eyebrow">PROJECT {project.number}</span>

            <h3 id="project-modal-title">{project.title}</h3>

            <span className="modal-project-type">{project.type}</span>
          </div>
        </div>

        <p className="modal-description">{project.description}</p>

        <div className="modal-content-grid">
          <div className="modal-info-block">
            <h4>The Challenge</h4>
            <p>{project.challenge}</p>
          </div>

          <div className="modal-info-block">
            <h4>My Approach</h4>
            <p>{project.solution}</p>
          </div>
        </div>

        <div className="modal-features">
          <h4>Key Features</h4>

          <div className="feature-list">
            {project.features.map((feature) => (
              <div key={feature}>
                <CheckCircle2 size={16} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-technologies">
          <h4>Technology Stack</h4>

          <div className="project-tags">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-demo-link"
          >
            Explore Live Project
            <ExternalLink size={17} />
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

function Projects() {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects =
    activeFilter === "All Projects"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        <motion.div
          className="projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker">
            <Sparkles size={15} />
            SELECTED WORK
          </span>

          <h2>
            Ideas Into <span>Real Solutions.</span>
          </h2>

          <p>
            A selection of projects where I turn ideas into functional,
            practical, and meaningful digital experiences.
          </p>
        </motion.div>

        <div className="projects-toolbar">
          <div className="projects-count">
            <span className="count-number">03</span>
            <span>Independent Projects</span>
          </div>

          <div
            className="project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.id}
                  layout
                  className={`project-card ${
                    project.featured ? "featured-project" : ""
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >
                  <div className="project-card-visual">
                    <ProjectPreview theme={project.theme} />

                    <span className="project-number">{project.number}</span>

                    {project.featured && (
                      <span className="featured-badge">
                        <Sparkles size={12} />
                        FEATURED PROJECT
                      </span>
                    )}
                  </div>

                  <div className="project-card-content">
                    <div className="project-card-meta">
                      <span>{project.category}</span>
                      <span className="project-status">
                        <i />
                        {project.status}
                      </span>
                    </div>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <div className="project-card-stack">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}

                      {project.technologies.length > 4 && (
                        <span>+{project.technologies.length - 4}</span>
                      )}
                    </div>

                    <div className="project-card-footer">
                      <button
                        className="project-details-button"
                        onClick={() => setSelectedProject(project)}
                      >
                        Explore Project
                        <ArrowUpRight size={17} />
                      </button>

                      <div className="project-card-icon">
                        <Icon size={19} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          className="projects-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <Layers3 size={19} />
            <span>Every project is independently designed and developed.</span>
          </div>

          <a href="#contact">
            Have a project in mind?
            <ArrowUpRight size={17} />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
