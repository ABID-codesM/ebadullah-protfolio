import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Code2,
  Server,
  Database,
  Smartphone,
  GitBranch,
  Terminal,
  Layers3,
  Braces,
  Workflow,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
  FolderCode,
  Lightbulb,
} from "lucide-react";

import "./Skills.css";

const skillCategories = [
  "All Skills",
  "Frontend",
  "Backend",
  "Database",
  "Mobile",
  "Tools",
];

const skills = [
  {
    name: "HTML5",
    category: "Frontend",
    symbol: "HTML",
    description: "Building structured and semantic web content.",
  },
  {
    name: "CSS3",
    category: "Frontend",
    symbol: "CSS",
    description: "Creating responsive layouts and modern interfaces.",
  },
  {
    name: "JavaScript",
    category: "Frontend",
    symbol: "JS",
    description: "Developing interactive and dynamic web experiences.",
  },
  // {
  //   name: "Tailwind CSS",
  //   category: "Frontend",
  //   symbol: "TW",
  //   description: "Building interfaces with utility-first styling.",
  // },
  {
    name: "React.js",
    category: "Frontend",
    symbol: "RE",
    description: "Creating component-based user interfaces.",
  },
  {
    name: "Node.js",
    category: "Backend",
    symbol: "ND",
    description: "Building server-side applications with JavaScript.",
  },
  {
    name: "Express.js",
    category: "Backend",
    symbol: "EX",
    description: "Developing backend routes and REST API services.",
  },
  {
    name: "Python",
    category: "Backend",
    symbol: "PY",
    description: "Working with Python for backend development.",
    learning: true,
  },
  {
    name: "Django",
    category: "Backend",
    symbol: "DJ",
    description: "Exploring Python-based web application development.",
    learning: true,
  },
  {
    name: "PostgreSQL",
    category: "Database",
    symbol: "PG",
    description: "Working with relational databases and SQL.",
  },
  {
    name: "React Native",
    category: "Mobile",
    symbol: "RN",
    description: "Building cross-platform mobile applications.",
  },
  {
    name: "Git",
    category: "Tools",
    symbol: "GT",
    description: "Managing source code and development history.",
  },
  {
    name: "GitHub",
    category: "Tools",
    symbol: "GH",
    description: "Hosting repositories and managing project code.",
  },
  {
    name: "Postman",
    category: "Tools",
    symbol: "PO",
    description: "Backend and API testing.",
  },
];

const experienceItems = [
  {
    id: "01",
    title: "Independent Full-Stack Development",
    subtitle: "Building Management System",
    type: "Completed Project",
    description:
      "Designed and independently developed a full-stack building management application, working across the frontend, backend, database, authentication, and management modules.",
    technologies: ["React", "Node.js", "Express.js", "PostgreSQL", "JWT"],
    icon: Layers3,
  },
  {
    id: "02",
    title: "Frontend Application Development",
    subtitle: "Budget Tracker & Number Guessing Game",
    type: "Completed Projects",
    description:
      "Built interactive browser-based applications using HTML, CSS, and JavaScript, with responsive interfaces, application logic, and LocalStorage for persistent data.",
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    icon: Code2,
  },
  {
    id: "03",
    title: "Continuous Technical Learning",
    subtitle: "Expanding Development Skills",
    type: "Ongoing Learning",
    description:
      "Continuously improving development knowledge, exploring backend technologies, and strengthening the ability to design and build complete software solutions.",
    technologies: ["Python", "Django", "React Native"],
    icon: GraduationCap,
  },
];

const categoryIcons = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  Mobile: Smartphone,
  Tools: GitBranch,
};

function SkillCard({ skill, index }) {
  return (
    <motion.article
      layout
      className="skill-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.35,
        delay: index * 0.045,
      }}
    >
      <div className="skill-card-top">
        <div className="skill-symbol">{skill.symbol}</div>

        <span className="skill-category-label">{skill.category}</span>
      </div>

      <h3>{skill.name}</h3>

      <p>{skill.description}</p>

      <div className="skill-card-bottom">
        {skill.learning ? (
          <span className="skill-learning">
            <span />
            Learning Focus
          </span>
        ) : (
          <span className="skill-used">
            <CheckCircle2 size={13} />
            Working With
          </span>
        )}

        <ArrowUpRight size={17} className="skill-arrow" />
      </div>
    </motion.article>
  );
}

function ExperienceCard({ item, index }) {
  const Icon = item.icon;

  return (
    <motion.article
      className="experience-card"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
      }}
    >
      <div className="experience-card-left">
        <span className="experience-number">{item.id}</span>

        <div className="experience-icon">
          <Icon size={21} />
        </div>
      </div>

      <div className="experience-card-content">
        <div className="experience-meta">
          <span>{item.type}</span>
          <span className="experience-indicator">
            <i />
            {item.id === "03" ? "Ongoing" : "Completed"}
          </span>
        </div>

        <h3>{item.title}</h3>

        <h4>{item.subtitle}</h4>

        <p>{item.description}</p>

        <div className="experience-technologies">
          {item.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function Skills() {
  const [activeCategory, setActiveCategory] = useState("All Skills");

  const filteredSkills =
    activeCategory === "All Skills"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        {/* Section Heading */}

        <motion.div
          className="skills-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="skills-kicker">
            <Sparkles size={15} />
            MY CAPABILITIES
          </span>

          <h2>
            Skills That <span>Build Solutions.</span>
          </h2>

          <p>
            A growing set of technologies and practical development skills I use
            to turn ideas into functional digital products.
          </p>
        </motion.div>

        {/* Skills Overview */}

        <div className="skills-overview">
          <motion.div
            className="skills-overview-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="overview-icon">
              <Workflow size={21} />
            </div>

            <div>
              <span>Development Approach</span>
              <h3>End-to-End Thinking</h3>
              <p>
                From user interfaces to backend logic and database integration.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="skills-overview-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div className="overview-icon violet">
              <Terminal size={21} />
            </div>

            <div>
              <span>Technical Focus</span>
              <h3>Full-Stack Development</h3>
              <p>Building connected frontend and backend applications.</p>
            </div>
          </motion.div>

          <motion.div
            className="skills-overview-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <div className="overview-icon green">
              <Lightbulb size={21} />
            </div>

            <div>
              <span>Growth Mindset</span>
              <h3>Continuous Learning</h3>
              <p>Improving through experimentation and independent projects.</p>
            </div>
          </motion.div>
        </div>

        {/* Technology Stack */}

        <div className="skills-main">
          <div className="skills-subheading">
            <div>
              <span className="skills-small-label">TECHNOLOGY STACK</span>

              <h3>Tools I Work With</h3>
            </div>

            <span className="skills-total">
              {skills.length.toString().padStart(2, "0")} Technologies
            </span>
          </div>

          {/* Category Filters */}

          <div
            className="skills-filters"
            role="group"
            aria-label="Filter skills by category"
          >
            {skillCategories.map((category) => {
              const Icon = categoryIcons[category];

              return (
                <button
                  key={category}
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                >
                  {Icon && <Icon size={14} />}
                  {category}
                </button>
              );
            })}
          </div>

          {/* Skill Cards */}

          <motion.div layout className="skills-grid">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="skills-note">
            <span className="note-dot" />
            <p>
              My technical toolkit continues to evolve as I build projects and
              explore new technologies.
            </p>
          </div>
        </div>

        {/* Practical Experience */}

        <div className="experience-section" id="experience">
          <motion.div
            className="experience-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <span className="skills-small-label">
                BEYOND THE TECHNOLOGIES
              </span>

              <h3>
                Practical <span>Experience.</span>
              </h3>

              <p>
                Real development practice gained through independently building
                and improving software projects.
              </p>
            </div>

            <div className="experience-heading-icon">
              <FolderCode size={27} />
            </div>
          </motion.div>

          <div className="experience-timeline">
            {experienceItems.map((item, index) => (
              <ExperienceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Closing Statement */}

        <motion.div
          className="skills-closing"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="closing-icon">
            <Braces size={22} />
          </div>

          <div>
            <h3>Always Building. Always Improving.</h3>

            <p>
              Every project is an opportunity to learn, solve problems, and
              become a better developer.
            </p>
          </div>

          <a href="#projects" aria-label="Explore projects">
            Explore Projects
            <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
