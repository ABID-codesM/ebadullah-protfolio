import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import "./Navbar.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      staggerChildren: 0.045,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.18,
      ease: "easeIn",
    },
  },
};

const linkVariants = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Detect active section and navbar scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* BRAND LOGO */}
        <a
          href="#home"
          className="navbar-brand"
          aria-label="EA Coder - Home"
          onClick={() => handleNavClick("home")}
        >
          <span className="brand-mark">
            <span>EA</span>
            <span className="brand-dot" />
          </span>

          <span className="brand-text">
            <span className="brand-name">
              EA<span>Coder</span>
            </span>

            <span className="brand-caption">DIGITAL DEVELOPER</span>
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navLinks.map((link) => {
            const section = link.href.replace("#", "");

            return (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link ${
                  activeSection === section ? "active" : ""
                }`}
                onClick={() => handleNavClick(section)}
              >
                {link.name}

                {activeSection === section && (
                  <motion.span
                    className="nav-active-indicator"
                    layoutId="nav-indicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <a
          href="#contact"
          className="navbar-cta"
          onClick={() => handleNavClick("contact")}
        >
          <span>Let's Talk</span>
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`mobile-menu-button ${menuOpen ? "menu-active" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={23} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu size={23} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* MOBILE NAVIGATION */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-navigation"
              aria-label="Mobile navigation"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mobile-menu-heading">
                <span>EXPLORE</span>
                <span className="mobile-menu-line" />
              </div>

              <div className="mobile-nav-links">
                {navLinks.map((link, index) => {
                  const section = link.href.replace("#", "");

                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      variants={linkVariants}
                      className={`mobile-nav-link ${
                        activeSection === section ? "active" : ""
                      }`}
                      onClick={() => handleNavClick(section)}
                    >
                      <span className="mobile-link-number">0{index + 1}</span>

                      <span className="mobile-link-name">{link.name}</span>

                      <ArrowUpRight className="mobile-link-icon" size={18} />
                    </motion.a>
                  );
                })}
              </div>

              <div className="mobile-menu-footer">
                <span>EA CODER</span>
                <span>BUILDING DIGITAL SOLUTIONS</span>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM ACCENT LINE */}
      <div className="navbar-bottom-line" />
    </header>
  );
}

export default Navbar;
