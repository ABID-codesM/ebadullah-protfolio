import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Download,
  Mail,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
// import {
//   ArrowDown,
//   ArrowRight,
//   ArrowUpRight,
//   Code2,
//   Download,
//   Facebook,
//   Github,
//   Linkedin,
//   Mail,
//   Sparkles,
// } from "lucide-react";

import "./Hero.css";

/* =========================================
   HERO CONTENT
========================================= */

const roles = [
  "Full-Stack Developer",
  "Web Developer",
  "Software Developer",
  "Digital Solutions Builder",
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/ABID-codesM",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ebadullah-abid-67a6863b3",
    icon: FaLinkedinIn,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/abed.pashton.7",
    icon: FaFacebookF,
  },
  {
    name: "Email",
    href: "mailto:ebadullahabid47@gmail.com",
    icon: Mail,
  },
];

/* =========================================
   ANIMATION VARIANTS
========================================= */

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const portraitVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    x: 30,
  },

  visible: {
    opacity: 1,
    scale: 1,
    x: 0,

    transition: {
      duration: 0.9,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================
   HERO COMPONENT
========================================= */

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  const [portraitLoaded, setPortraitLoaded] = useState(true);

  /* =========================================
     ANIMATED ROLE SWITCHING
  ========================================= */

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setRoleIndex((previous) => {
        return (previous + 1) % roles.length;
      });
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* BACKGROUND EFFECTS */}

      <div className="hero-background">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-grid-pattern" />

        <div className="hero-background-orb" />
      </div>

      {/* MAIN CONTENT */}

      <div className="hero-container">
        {/* LEFT CONTENT */}

        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* INTRO LABEL */}

          <motion.div className="hero-eyebrow" variants={itemVariants}>
            <span className="hero-eyebrow-icon">
              <Sparkles size={14} />
            </span>

            <span>WELCOME TO MY DIGITAL SPACE</span>
          </motion.div>

          {/* INTRODUCTION */}

          <motion.div className="hero-introduction" variants={itemVariants}>
            <span className="hero-greeting">Hi, I'm</span>

            <h1 className="hero-title">
              Ebadullah
              <span className="hero-title-highlight">
                ABID<span className="hero-title-dot">.</span>
              </span>
            </h1>
          </motion.div>

          {/* ANIMATED ROLE */}

          <motion.div className="hero-role-wrapper" variants={itemVariants}>
            <span className="hero-role-prefix">I'm a</span>

            <span className="hero-role-animation">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={roleIndex}
                  className="hero-role"
                  initial={{
                    opacity: 0,
                    y: 18,
                    filter: "blur(5px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                    filter: "blur(5px)",
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* DESCRIPTION */}

          <motion.p className="hero-description" variants={itemVariants}>
            I turn ideas into meaningful digital experiences, building modern
            web applications and reliable software solutions that solve
            real-world problems.
          </motion.p>

          {/* ACTION BUTTONS */}

          <motion.div className="hero-actions" variants={itemVariants}>
            <a href="#projects" className="hero-button hero-button-primary">
              <span>Explore My Work</span>

              <ArrowUpRight size={18} />
            </a>

            <a href="#contact" className="hero-button hero-button-secondary">
              <span>Let's Talk</span>

              <ArrowRight size={17} />
            </a>

            <a
              href="/Ebadullah-Abid-CV.pdf"
              download="Ebadullah-Abid-CV.pdf"
              className="hero-button hero-button-cv"
            >
              <Download size={17} />

              <span>Download CV</span>
            </a>
          </motion.div>

          {/* SOCIAL LINKS */}

          <motion.div className="hero-social-section" variants={itemVariants}>
            <span className="hero-social-label">FIND ME ON</span>

            <div className="hero-social-links">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                // const Icon = socialLinks[3].icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.name === "Email" ? undefined : "_blank"}
                    rel={
                      social.name === "Email"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="hero-social-link"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {/* <Icon size={18} strokeWidth={1.8} /> */}
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT VISUAL */}

        <motion.div
          className="hero-visual"
          variants={portraitVariants}
          initial="hidden"
          animate="visible"
        >
          {/* DECORATIVE ORBITS */}

          <div className="portrait-orbit portrait-orbit-one" />
          <div className="portrait-orbit portrait-orbit-two" />

          {/* PORTRAIT GLOW */}

          <div className="portrait-glow" />

          {/* IMAGE FRAME */}

          <div className="portrait-frame">
            <div className="portrait-frame-top">
              <span />
              <span />
              <span />
            </div>

            <div className="portrait-image-wrapper">
              {portraitLoaded ? (
                <img
                  src="/images/profile/portrait.webp"
                  alt="Portrait of Ebadullah Abid"
                  className="portrait-image"
                  onError={() => setPortraitLoaded(false)}
                />
              ) : (
                <div className="portrait-placeholder">
                  <span className="portrait-placeholder-mark">EA</span>

                  <span className="portrait-placeholder-text">
                    YOUR PORTRAIT
                  </span>
                </div>
              )}

              <div className="portrait-image-overlay" />
            </div>

            {/* IMAGE CORNER DETAILS */}

            <div className="portrait-corner portrait-corner-top" />
            <div className="portrait-corner portrait-corner-bottom" />
          </div>

          {/* FLOATING TECH CARD */}

          <motion.div
            className="floating-tech-card"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="floating-card-icon">
              <Code2 size={19} />
            </div>

            <div className="floating-card-content">
              <span>DEVELOPMENT STACK</span>

              <strong>React · Node.js · PostgreSQL</strong>
            </div>
          </motion.div>

          {/* FLOATING IDEA CARD */}

          <motion.div
            className="floating-idea-card"
            animate={{
              y: [0, 9, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="idea-card-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <span>MY APPROACH</span>

              <strong>Idea → Solution</strong>
            </div>
          </motion.div>

          {/* SMALL DECORATIVE ELEMENT */}

          <div className="portrait-decoration">
            <span />
            <span />
            <span />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM INFORMATION */}

      <div className="hero-bottom">
        <span className="hero-bottom-text">
          BUILDING DIGITAL SOLUTIONS WITH PURPOSE
        </span>

        <a
          href="#about"
          className="hero-scroll-link"
          aria-label="Scroll to About section"
        >
          <span>SCROLL TO EXPLORE</span>

          <span className="hero-scroll-icon">
            <ArrowDown size={15} />
          </span>
        </a>
      </div>
    </section>
  );
}

export default Hero;
