import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Mail,
  Code2,
  Heart,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

// import {
//   ArrowDown,
//   ArrowRight,
//   ArrowUp,
//   ArrowUpRight,
//   Github,
//   Linkedin,
//   Facebook,
//   Mail,
//   Code2,
//   Heart,
//   Sparkles,
// } from "lucide-react";

import "./Footer.css";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills & Expertise", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

const exploreLinks = [
  { label: "Services", href: "#services" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    icon: FaGithub,
    href: "https://github.com/ABID-codesM",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/ebadullah-abid-67a6863b3",
  },
  {
    label: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/abed.pashton.7",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:ebadullahabid47@gmail.com",
  },
];

const footerVariants = {
  hidden: {
    opacity: 0,
    y: 25,
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

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer-section">
      {/* Background Effects */}
      <div className="footer-background">
        <div className="footer-glow footer-glow-left" />
        <div className="footer-glow footer-glow-right" />
        <div className="footer-top-line" />
      </div>

      <div className="footer-container">
        {/* Main Footer */}
        <motion.div
          className="footer-main"
          initial="hidden"
          whileInView="visible"
          variants={footerVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand Column */}
          <div className="footer-brand">
            <a
              href="#home"
              className="footer-logo"
              aria-label="Ebadullah Abid - Back to Home"
            >
              <span className="footer-logo-mark">
                E<span>A</span>
                <i />
              </span>

              <span className="footer-logo-text">
                Ebadullah
                <strong>Abid.</strong>
              </span>
            </a>

            <p className="footer-brand-description">
              Building meaningful digital experiences through thoughtful design,
              modern technologies, and reliable software solutions.
            </p>

            <div className="footer-brand-tag">
              <Code2 size={15} />
              <span>Turning ideas into digital solutions.</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer-column">
            <h3>Navigation</h3>

            <ul>
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    <ArrowRight size={13} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Column */}
          <div className="footer-column">
            <h3>Explore</h3>

            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    <ArrowRight size={13} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="footer-column footer-connect">
            <h3>Let's Connect</h3>

            <p>
              Have an idea, opportunity, or something interesting to discuss?
              Let's connect.
            </p>

            <a
              href="mailto:ebadullahabid47@gmail.com"
              className="footer-email-link"
            >
              <Mail size={16} />
              <span>Get in Touch</span>
              <ArrowUpRight size={15} />
            </a>

            <div className="footer-socials">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                //const Icon = socialLinks[3].icon;

                return (
                  <a
                    href={social.href}
                    key={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Footer Highlight */}
        <motion.div
          className="footer-highlight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footer-highlight-content">
            <span>
              <Sparkles size={14} />
              HAVE A GREAT IDEA?
            </span>

            <h3>
              Let's create something
              <span> extraordinary.</span>
            </h3>
          </div>

          <a href="#contact" className="footer-highlight-button">
            Start a Project
            <ArrowUpRight size={17} />
          </a>
        </motion.div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} <strong>Ebadullah Abid.</strong>
            <span> All rights reserved.</span>
          </p>

          <div className="footer-made-with">
            <span>Designed & Developed with</span>
            <Heart size={13} />
            <span>and</span>
            <Code2 size={14} />
          </div>

          <button
            className="footer-back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={19} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
