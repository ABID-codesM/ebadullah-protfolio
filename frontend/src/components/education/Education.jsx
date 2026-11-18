import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import "./Education.css";

const educationData = [
  {
    id: 1,
    period: "2021",
    status: "COMPLETED",
    title: "High School",
    degree: "High School Graduation",
    description:
      "Successfully completed high school education with a strong academic foundation and a commitment to continuous learning.",
    score: "95.58%",
    scoreLabel: "Final Academic Result",
    icon: GraduationCap,
    highlights: [
      "Graduated in 2021",
      "Strong academic performance",
      "Foundation for Computer Science studies",
    ],
  },
  {
    id: 2,
    period: "Current Academic Journey",
    status: "IN PROGRESS",
    title: "Computer Science",
    degree: "Undergraduate Studies",
    description:
      "Pursuing Computer Science studies with a focus on programming, software development, problem-solving, and building practical technical solutions.",
    score: "93.94%",
    scoreLabel: "7th Semester Result",
    icon: BookOpen,
    highlights: [
      "Fourth-Year Computer Science Student",
      "Currently in the 7th Semester",
      "First in Class",
    ],
  },
];

const learningAreas = [
  "Programming & Software Development",
  "Web Application Development",
  "Database Management",
  "Computer Science Fundamentals",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

function Education() {
  return (
    <section className="education-section" id="education">
      <div className="education-background">
        <div className="education-glow education-glow-one" />
        <div className="education-glow education-glow-two" />
        <div className="education-grid" />
      </div>

      <div className="education-container">
        {/* Section Heading */}
        <motion.div
          className="education-heading"
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="education-eyebrow">
            <Sparkles size={15} />
            EDUCATION & ACHIEVEMENTS
          </span>

          <h2>
            The Journey Behind
            <span> My Knowledge.</span>
          </h2>

          <p>
            Every achievement represents dedication, discipline, and a
            continuous commitment to learning and growth.
          </p>
        </motion.div>

        {/* Academic Statistics */}
        <motion.div
          className="education-stats"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="education-stat-card" variants={itemVariants}>
            <div className="education-stat-icon">
              <GraduationCap size={22} />
            </div>

            <div>
              <strong>Computer Science</strong>
              <span>Field of Study</span>
            </div>
          </motion.div>

          <motion.div className="education-stat-card" variants={itemVariants}>
            <div className="education-stat-icon">
              <Trophy size={22} />
            </div>

            <div>
              <strong>First in Class</strong>
              <span>Academic Achievement</span>
            </div>
          </motion.div>

          <motion.div className="education-stat-card" variants={itemVariants}>
            <div className="education-stat-icon">
              <Award size={22} />
            </div>

            <div>
              <strong>93.94%</strong>
              <span>7th Semester Result</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Academic Timeline */}
        <div className="education-timeline-heading">
          <span>ACADEMIC TIMELINE</span>
          <div />
        </div>

        <motion.div
          className="education-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {educationData.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                className={`education-item ${
                  index === 1 ? "education-item-current" : ""
                }`}
                variants={itemVariants}
                key={item.id}
              >
                {/* Timeline Marker */}
                <div className="education-timeline-marker">
                  <div className="education-marker-inner">
                    <Icon size={21} />
                  </div>
                </div>

                {/* Education Card */}
                <div className="education-card">
                  <div className="education-card-top">
                    <div className="education-period">
                      <CalendarDays size={15} />
                      {item.period}
                    </div>

                    <span
                      className={`education-status ${
                        item.status === "IN PROGRESS"
                          ? "status-active"
                          : "status-completed"
                      }`}
                    >
                      <span />
                      {item.status}
                    </span>
                  </div>

                  <div className="education-card-content">
                    <div className="education-card-main">
                      <span className="education-card-label">
                        {item.degree}
                      </span>

                      <h3>{item.title}</h3>

                      <p>{item.description}</p>

                      <div className="education-highlights">
                        {item.highlights.map((highlight) => (
                          <div className="education-highlight" key={highlight}>
                            <CheckCircle2 size={15} />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result Card */}
                    <div className="education-result">
                      <div className="education-result-icon">
                        <Award size={23} />
                      </div>

                      <strong>{item.score}</strong>

                      <span>{item.scoreLabel}</span>

                      <div className="education-result-line" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Knowledge Areas */}
        <motion.div
          className="education-knowledge"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="education-knowledge-header">
            <div className="knowledge-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <span>AREAS OF LEARNING</span>
              <h3>Building Knowledge Through Learning.</h3>
            </div>
          </div>

          <div className="education-knowledge-list">
            {learningAreas.map((area, index) => (
              <motion.div
                className="education-knowledge-item"
                key={area}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <span className="knowledge-number">0{index + 1}</span>

                <span>{area}</span>

                <ArrowUpRight size={17} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          className="education-quote"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
        >
          <div className="education-quote-line" />

          <p>
            Learning doesn't end with a degree.
            <span>
              {" "}
              It evolves with every challenge, project, and new idea.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Education;
