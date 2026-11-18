import { motion } from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers3,
  Database,
  Server,
  MonitorSmartphone,
  Building2,
  Workflow,
  Search,
  PenTool,
  Rocket,
  CheckCircle2,
  Sparkles,
  Braces,
  Terminal,
} from "lucide-react";

import "./Services.css";

const services = [
  {
    id: "01",
    title: "Frontend Development",
    description:
      "Creating modern, responsive, and interactive user interfaces that deliver clear and engaging digital experiences.",
    icon: MonitorSmartphone,
    color: "cyan",
    features: [
      "Responsive website interfaces",
      "React.js development",
      "Reusable UI components",
      "Interactive user experiences",
    ],
  },
  {
    id: "02",
    title: "Backend Development",
    description:
      "Developing reliable server-side applications, business logic, and backend systems that power modern web platforms.",
    icon: Server,
    color: "violet",
    features: [
      "Node.js and Express.js",
      "REST API development",
      "Authentication and authorization",
      "Server-side application logic",
    ],
  },
  {
    id: "03",
    title: "Database Design",
    description:
      "Designing structured database solutions to organize application data and support reliable information management.",
    icon: Database,
    color: "green",
    features: [
      "Relational database design",
      "PostgreSQL integration",
      "Data modeling",
      "SQL queries and relationships",
    ],
  },
  {
    id: "04",
    title: "Business Management Systems",
    description:
      "Developing custom management applications that help organize business operations, records, and administrative workflows.",
    icon: Building2,
    color: "orange",
    features: [
      "Custom management dashboards",
      "Administrative modules",
      "Role-based access concepts",
      "Structured information management",
    ],
  },
  {
    id: "05",
    title: "API Development & Integration",
    description:
      "Building and connecting APIs to enable smooth communication between frontend applications, backend services, and databases.",
    icon: Workflow,
    color: "blue",
    features: [
      "RESTful API architecture",
      "Frontend and backend integration",
      "API request handling",
      "Structured data exchange",
    ],
  },
  {
    id: "06",
    title: "Website Improvement",
    description:
      "Improving existing web applications through interface refinements, responsive adjustments, and functional enhancements.",
    icon: Code2,
    color: "pink",
    features: [
      "Responsive layout improvements",
      "UI refinements",
      "Frontend functionality updates",
      "Application enhancements",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand the idea, goals, requirements, and the problem that needs to be solved.",
    icon: Search,
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Define the structure, technical approach, and the development direction.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Develop",
    description:
      "Build the application with organized code and connected components.",
    icon: Terminal,
  },
  {
    number: "04",
    title: "Refine",
    description:
      "Review functionality, improve the experience, and prepare the final result.",
    icon: Rocket,
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <motion.article
      className={`service-card service-${service.color}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
      }}
    >
      <div className="service-card-top">
        <div className="service-icon">
          <Icon size={23} strokeWidth={1.8} />
        </div>

        <span className="service-number">{service.id}</span>
      </div>

      <h3>{service.title}</h3>

      <p>{service.description}</p>

      <div className="service-features">
        {service.features.map((feature) => (
          <div key={feature}>
            <CheckCircle2 size={14} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <a
        href="#contact"
        className="service-link"
        aria-label={`Discuss ${service.title}`}
      >
        Discuss this service
        <ArrowUpRight size={17} />
      </a>
    </motion.article>
  );
}

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        {/* Section Heading */}

        <motion.div
          className="services-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="services-kicker">
            <Sparkles size={15} />
            WHAT I CAN BUILD
          </span>

          <h2>
            Services Designed
            <br />
            <span>To Solve Problems.</span>
          </h2>

          <p>
            From modern user interfaces to complete web applications, I focus on
            building practical digital solutions around real requirements.
          </p>
        </motion.div>

        {/* Featured Service */}

        <motion.div
          className="featured-service"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="featured-service-content">
            <span className="featured-service-label">
              <Sparkles size={14} />
              CORE SERVICE
            </span>

            <div className="featured-service-icon">
              <Layers3 size={27} />
            </div>

            <h3>
              Full-Stack
              <br />
              Web Development
            </h3>

            <p>
              Complete web applications built by connecting modern frontend
              interfaces, backend logic, APIs, and structured databases into one
              integrated solution.
            </p>

            <div className="featured-service-points">
              <span>
                <CheckCircle2 size={15} />
                Frontend Development
              </span>

              <span>
                <CheckCircle2 size={15} />
                Backend Development
              </span>

              <span>
                <CheckCircle2 size={15} />
                Database Integration
              </span>
            </div>

            <a href="#contact" className="featured-service-button">
              Let's Discuss Your Project
              <ArrowRight size={17} />
            </a>
          </div>

          {/* Architecture Visual */}

          <div className="service-architecture">
            <div className="architecture-glow" />

            <div className="architecture-top">
              <span>APPLICATION ARCHITECTURE</span>
              <span className="architecture-status">
                <i />
                CONNECTED
              </span>
            </div>

            <div className="architecture-flow">
              <div className="architecture-node frontend-node">
                <div className="architecture-node-icon">
                  <MonitorSmartphone size={20} />
                </div>

                <div>
                  <strong>Frontend</strong>
                  <span>React.js / UI</span>
                </div>

                <span className="node-indicator" />
              </div>

              <div className="architecture-connector">
                <span />
                <span />
              </div>

              <div className="architecture-node backend-node">
                <div className="architecture-node-icon">
                  <Server size={20} />
                </div>

                <div>
                  <strong>Backend</strong>
                  <span>Node.js / API</span>
                </div>

                <span className="node-indicator" />
              </div>

              <div className="architecture-connector">
                <span />
                <span />
              </div>

              <div className="architecture-node database-node">
                <div className="architecture-node-icon">
                  <Database size={20} />
                </div>

                <div>
                  <strong>Database</strong>
                  <span>PostgreSQL</span>
                </div>

                <span className="node-indicator" />
              </div>
            </div>

            <div className="architecture-footer">
              <Braces size={17} />
              <span>Connected digital solutions</span>
              <span className="architecture-version">SYSTEM / 01</span>
            </div>
          </div>
        </motion.div>

        {/* Other Services */}

        <div className="services-subheading">
          <div>
            <span className="services-small-label">AREAS OF EXPERTISE</span>

            <h3>More Ways I Can Help</h3>
          </div>

          <span className="services-count">06 SERVICES</span>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Development Process */}

        <div className="process-section">
          <motion.div
            className="process-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="services-small-label">
              HOW I APPROACH PROJECTS
            </span>

            <h3>
              From Idea <span>To Implementation.</span>
            </h3>

            <p>
              A structured approach helps transform an initial idea into a clear
              and functional digital solution.
            </p>
          </motion.div>

          <div className="process-grid">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  className="process-card"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                >
                  <div className="process-card-top">
                    <div className="process-icon">
                      <Icon size={21} />
                    </div>

                    <span>{step.number}</span>
                  </div>

                  <h4>{step.title}</h4>

                  <p>{step.description}</p>

                  {index !== processSteps.length - 1 && (
                    <div className="process-connector">
                      <ArrowRight size={17} />
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}

        <motion.div
          className="services-cta"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="services-cta-decoration">
            <div />
            <div />
            <div />
          </div>

          <div className="services-cta-icon">
            <Sparkles size={23} />
          </div>

          <div className="services-cta-content">
            <span>HAVE AN IDEA?</span>

            <h3>
              Let's Build Something
              <span> Meaningful.</span>
            </h3>

            <p>
              Have a website idea or a business problem that needs a digital
              solution? Let's discuss what can be built.
            </p>
          </div>

          <a href="#contact" className="services-cta-button">
            Start a Conversation
            <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
