import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  X,
  Layers3,
  Wallet,
  Gamepad2,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import bmsDashboard from "../../../assets/projects/bms/dashboard.png";
import bmsBuildings from "../../../assets/projects/bms/buildings.png";
import bmsLogin from "../../../assets/projects/bms/login.png";
import bmsPayments from "../../../assets/projects/bms/payments.png";
import bmsTenants from "../../../assets/projects/bms/tenants.png";

import budgetHome from "../../../assets/projects/budget-tracker/home.jpeg";
import budgetTransactions from "../../../assets/projects/budget-tracker/transactions.jpeg";

import gameHome from "../../../assets/projects/number-game/home.png";
import gameStart from "../../../assets/projects/number-game/start.png";

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
      "A centralized property management platform designed to organize multiple buildings, rentable units, tenant records, rental contracts, and payment workflows.",
    challenge:
      "Paper-based property records can become fragmented, making it difficult to coordinate tenant information, rental records, and recurring payment calculations across multiple buildings.",
    solution:
      "Independently developed a full-stack web application with dedicated modules for buildings, employees, tenants, rentals, rental services, tenant payments, and salary management.",
    features: [
      "Multiple building and property management",
      "Employee and tenant records",
      "Rental and contract management",
      "Tenant payment tracking",
      "Paid, partial, and pending payment statuses",
      "Utility cost calculation from meter readings",
      "JWT-based authentication",
    ],
    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "JWT",
    ],
    images: [
      { src: bmsDashboard, alt: "Building Management System dashboard" },
      { src: bmsBuildings, alt: "Building Management System buildings screen" },
      { src: bmsTenants, alt: "Building Management System tenants screen" },
      { src: bmsPayments, alt: "Building Management System payments screen" },
      { src: bmsLogin, alt: "Building Management System login screen" },
    ],
    demo: "https://ABID-codesM.github.io/BMS-Fullstack",
    featured: true,
    icon: LayoutDashboard,
    status: "Completed",
    accent: "cyan",
  },
  {
    id: 2,
    number: "02",
    title: "Budget Tracker System",
    shortTitle: "Budget Tracker",
    category: "Frontend",
    type: "Personal Finance Web Application",
    description:
      "A responsive browser-based application for organizing income, monitoring expenses, and keeping budget information available between visits.",
    challenge:
      "Tracking personal income and expenses without a clear overview can make everyday budget organization unnecessarily difficult.",
    solution:
      "Built a lightweight budget tracker with an organized interface and LocalStorage persistence, allowing budget information to remain in the browser.",
    features: [
      "Income and expense tracking",
      "Budget overview",
      "Transaction management",
      "LocalStorage data persistence",
      "Responsive user interface",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    images: [
      { src: budgetHome, alt: "Budget Tracker home dashboard" },
      { src: budgetTransactions, alt: "Budget Tracker transactions screen" },
    ],
    demo: "https://ABID-codesM.github.io/budget-tracker-system",
    featured: false,
    icon: Wallet,
    status: "Completed",
    accent: "emerald",
  },
  {
    id: 3,
    number: "03",
    title: "Number Guessing Game",
    shortTitle: "Number Guessing",
    category: "Frontend",
    type: "Interactive Web Game",
    description:
      "An interactive number guessing game with multiple difficulty levels, limited attempts, hints, and score tracking.",
    challenge:
      "The goal was to make a simple guessing concept more engaging through clear game feedback and progressively challenging modes.",
    solution:
      "Developed the game with vanilla JavaScript, adding difficulty selection, attempt tracking, hints, score handling, and browser-based high-score storage.",
    features: [
      "Easy, Medium, and Hard modes",
      "Difficulty-based attempt limits",
      "Hints and instant feedback",
      "Score tracking",
      "Restart functionality",
      "LocalStorage high scores",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    images: [
      { src: gameHome, alt: "Number Guessing Game main screen" },
      { src: gameStart, alt: "Number Guessing Game start screen" },
    ],
    demo: null,
    featured: false,
    icon: Gamepad2,
    status: "Completed",
    accent: "violet",
  },
];

const filters = ["All Projects", "Full-Stack", "Frontend"];

function ProjectGallery({ project, selectedImage, onSelect }) {
  const activeImage = project.images[selectedImage] ?? project.images[0];

  return (
    <div className="project-gallery">
      <div className="project-gallery-main">
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          className="project-gallery-image"
        />
        <span className="gallery-counter">
          {String(selectedImage + 1).padStart(2, "0")} /{" "}
          {String(project.images.length).padStart(2, "0")}
        </span>
      </div>

      {project.images.length > 1 && (
        <div
          className="project-gallery-thumbnails"
          aria-label="Project screenshots"
        >
          {project.images.map((image, index) => (
            <button
              type="button"
              key={image.src}
              className={`gallery-thumbnail ${
                selectedImage === index ? "active" : ""
              }`}
              onClick={() => onSelect(index)}
              aria-label={`Show screenshot ${index + 1}: ${image.alt}`}
              aria-pressed={selectedImage === index}
            >
              <img src={image.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [activeImage, setActiveImage] = useState(0);
  const Icon = project.icon;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % project.images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveImage(
          (current) =>
            (current - 1 + project.images.length) % project.images.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, project.images.length]);

  return createPortal(
    <motion.div
      className="project-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 28, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="modal-topline">
          <span className="modal-project-index">
            PROJECT / {project.number}
          </span>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            <X size={19} />
          </button>
        </div>

        <div className="modal-heading">
          <div className={`modal-icon accent-${project.accent}`}>
            <Icon size={24} />
          </div>
          <div>
            <span className="project-eyebrow">
              {project.category} DEVELOPMENT
            </span>
            <h3 id="project-modal-title">{project.title}</h3>
            <span className="modal-project-type">{project.type}</span>
          </div>
        </div>

        <ProjectGallery
          project={project}
          selectedImage={activeImage}
          onSelect={setActiveImage}
        />

        {project.images.length > 1 && (
          <div className="gallery-controls">
            <span>SCREENSHOTS</span>
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveImage(
                    (current) =>
                      (current - 1 + project.images.length) %
                      project.images.length,
                  )
                }
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImage(
                    (current) => (current + 1) % project.images.length,
                  )
                }
                aria-label="Next screenshot"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}

        <p className="modal-description">{project.description}</p>

        <div className="modal-content-grid">
          <div className="modal-info-block">
            <span className="info-label">01 / THE CHALLENGE</span>
            <h4>The problem</h4>
            <p>{project.challenge}</p>
          </div>
          <div className="modal-info-block">
            <span className="info-label">02 / MY APPROACH</span>
            <h4>The solution</h4>
            <p>{project.solution}</p>
          </div>
        </div>

        <div className="modal-features">
          <h4>Key capabilities</h4>
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
          <h4>Technology stack</h4>
          <div className="project-tags">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>

        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-demo-link"
          >
            View live project
            <ExternalLink size={16} />
          </a>
        ) : (
          <p className="modal-demo-note">
            <ImageIcon size={15} />
            Screenshots available · Live demo link not provided
          </p>
        )}
      </motion.div>
    </motion.div>,
    document.body,
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
      <div className="projects-orb projects-orb-one" aria-hidden="true" />
      <div className="projects-orb projects-orb-two" aria-hidden="true" />

      <div className="projects-container">
        <motion.div
          className="projects-heading"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-kicker">
            <Sparkles size={15} />
            SELECTED WORK
          </span>

          <h2>
            Ideas Into <span>Real Solutions.</span>
          </h2>

          <p>
            A closer look at independently built applications — from solving
            practical problems to shaping thoughtful digital experiences.
          </p>
        </motion.div>

        <div className="projects-toolbar">
          <div className="projects-count">
            <span className="count-number">03</span>
            <span>Independent projects</span>
          </div>

          <div
            className="project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((filter) => (
              <button
                type="button"
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

        <motion.div layout className="projects-grid">
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    layout: { duration: 0.35 },
                    opacity: { duration: 0.35, delay: index * 0.06 },
                    y: { duration: 0.45, delay: index * 0.06 },
                  }}
                >
                  <button
                    type="button"
                    className="project-visual-button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`View screenshots and details for ${project.title}`}
                  >
                    <div
                      className={`project-card-visual accent-${project.accent}`}
                    >
                      <img
                        className="project-cover-image"
                        src={project.images[0].src}
                        alt={project.images[0].alt}
                        loading={project.featured ? "eager" : "lazy"}
                      />
                      <span className="project-number">{project.number}</span>
                      {project.featured && (
                        <span className="featured-badge">
                          <Sparkles size={12} />
                          FEATURED PROJECT
                        </span>
                      )}
                      <span className="visual-open">
                        <ArrowUpRight size={19} />
                      </span>
                      <span className="visual-caption">
                        <ImageIcon size={13} />
                        REAL PROJECT SCREENSHOT
                      </span>
                    </div>
                  </button>

                  <div className="project-card-content">
                    <div className="project-card-meta">
                      <span>{project.category}</span>
                      <span className="project-status">
                        <i />
                        {project.status}
                      </span>
                    </div>

                    <div className="project-title-row">
                      <h3>{project.title}</h3>
                      <span
                        className={`project-card-icon accent-${project.accent}`}
                      >
                        <Icon size={19} />
                      </span>
                    </div>

                    <p>{project.description}</p>

                    <div className="project-card-stack">
                      {project.technologies.slice(0, 4).map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span>+{project.technologies.length - 4}</span>
                      )}
                    </div>

                    <div className="project-card-footer">
                      <div className="project-card-actions">
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-live-link"
                            aria-label={`View live ${project.title} project`}
                          >
                            View live project
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          type="button"
                          className="project-details-button"
                          onClick={() => setSelectedProject(project)}
                        >
                          Explore project
                          <ArrowUpRight size={17} />
                        </button>
                      </div>
                      <span className="project-image-count">
                        <ImageIcon size={14} />
                        {project.images.length} views
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="projects-bottom"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Layers3 size={19} />
            <span>
              Designed and developed independently, from concept to
              implementation.
            </span>
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
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
