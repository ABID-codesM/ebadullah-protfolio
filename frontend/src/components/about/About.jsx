import { motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  Database,
  Layers3,
  Lightbulb,
  Target,
  Workflow,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";

import "./About.css";

/* =========================================
   ANIMATION VARIANTS
========================================= */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================
   ABOUT DATA
========================================= */

const focusAreas = [
  {
    number: "01",
    title: "Frontend Development",
    description:
      "Creating responsive, intuitive and engaging user interfaces with modern frontend technologies.",
    icon: Code2,
  },
  {
    number: "02",
    title: "Backend Development",
    description:
      "Building application logic, secure APIs and reliable server-side functionality.",
    icon: Braces,
  },
  {
    number: "03",
    title: "Database Design",
    description:
      "Structuring data and developing organized database solutions for practical applications.",
    icon: Database,
  },
  {
    number: "04",
    title: "Complete Solutions",
    description:
      "Connecting frontend, backend and databases into cohesive software systems.",
    icon: Workflow,
  },
];

const principles = [
  {
    icon: Target,
    title: "Purpose First",
    description:
      "Understand the problem before deciding how to build the solution.",
  },
  {
    icon: Layers3,
    title: "Structured Thinking",
    description:
      "Organize applications into clear, maintainable and connected components.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description:
      "Keep exploring better approaches, technologies and development practices.",
  },
];

/* =========================================
   ABOUT COMPONENT
========================================= */

function About() {
  return (
    <section className="about-section" id="about">
      {/* BACKGROUND DECORATION */}

      <div className="about-background">
        <div className="about-glow about-glow-one" />
        <div className="about-glow about-glow-two" />
        <div className="about-grid" />
      </div>

      <div className="about-container">
        {/* SECTION HEADING */}

        <motion.div
          className="about-heading"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="about-eyebrow" variants={revealVariants}>
            <Sparkles size={14} />

            <span>GET TO KNOW ME</span>
          </motion.div>

          <motion.div className="about-title-row" variants={revealVariants}>
            <h2 className="about-title">
              More Than Just
              <span> Writing Code.</span>
            </h2>

            <span className="about-section-number">01 / ABOUT</span>
          </motion.div>

          <motion.p
            className="about-heading-description"
            variants={revealVariants}
          >
            A developer focused on turning real-world challenges into
            thoughtful, functional and reliable digital solutions.
          </motion.p>
        </motion.div>

        {/* MAIN ABOUT GRID */}

        <div className="about-main-grid">
          {/* LEFT: PERSONAL INTRODUCTION */}

          <motion.div
            className="about-story"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="about-story-label" variants={revealVariants}>
              <span className="about-label-line" />
              <span>MY STORY & APPROACH</span>
            </motion.div>

            <motion.h3 className="about-story-title" variants={revealVariants}>
              I believe great software starts with
              <span> understanding the problem.</span>
            </motion.h3>

            <motion.p
              className="about-story-paragraph"
              variants={revealVariants}
            >
              I'm Ebadullah Abid, a Computer Science developer passionate about
              building modern web applications and practical software solutions.
            </motion.p>

            <motion.p
              className="about-story-paragraph"
              variants={revealVariants}
            >
              My work focuses on connecting frontend experiences, backend
              functionality and database architecture to create complete
              applications that address real-world needs.
            </motion.p>

            <motion.p
              className="about-story-paragraph"
              variants={revealVariants}
            >
              Through independently developed projects, I've been building
              practical experience in designing application structures,
              implementing features and bringing different technologies
              together.
            </motion.p>

            <motion.div
              className="about-story-highlight"
              variants={revealVariants}
            >
              <div className="about-highlight-icon">
                <Lightbulb size={21} />
              </div>

              <p>
                I don't just focus on writing code. I focus on understanding
                what needs to be built, why it matters and how to build it
                properly.
              </p>
            </motion.div>

            <motion.a
              href="#projects"
              className="about-project-link"
              variants={revealVariants}
            >
              <span>Explore My Projects</span>

              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>

          {/* RIGHT: DEVELOPMENT FOCUS */}

          <motion.div
            className="about-focus-panel"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="about-focus-header"
              variants={revealVariants}
            >
              <div>
                <span className="about-panel-overline">WHAT I FOCUS ON</span>

                <h3>Building Complete Solutions</h3>
              </div>

              <span className="about-panel-icon">
                <Terminal size={21} />
              </span>
            </motion.div>

            <div className="about-focus-list">
              {focusAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <motion.div
                    className="about-focus-item"
                    key={area.number}
                    variants={revealVariants}
                  >
                    <span className="about-focus-number">{area.number}</span>

                    <span className="about-focus-icon">
                      <Icon size={20} />
                    </span>

                    <div className="about-focus-content">
                      <h4>{area.title}</h4>

                      <p>{area.description}</p>
                    </div>

                    <ArrowDownRight className="about-focus-arrow" size={17} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* DEVELOPMENT PRINCIPLES */}

        <motion.div
          className="about-principles"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="about-principles-heading"
            variants={revealVariants}
          >
            <div>
              <span className="about-label-line" />

              <span className="about-principles-label">HOW I THINK & WORK</span>
            </div>

            <h3>The Principles Behind My Work</h3>
          </motion.div>

          <div className="about-principles-grid">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.article
                  className="about-principle-card"
                  key={principle.title}
                  variants={revealVariants}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div className="about-principle-top">
                    <span>0{index + 1}</span>

                    <Icon size={21} />
                  </div>

                  <h4>{principle.title}</h4>

                  <p>{principle.description}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* FINAL STATEMENT */}

        <motion.div
          className="about-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="about-bottom-icon">
            <Code2 size={20} />
          </span>

          <p>
            From an idea to a complete application —
            <strong> thoughtful engineering makes the difference.</strong>
          </p>

          <a href="#contact" aria-label="Get in touch">
            <ArrowUpRight size={19} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
