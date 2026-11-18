import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
// import {
//   ArrowUpRight,
//   CheckCircle2,
//   Github,
//   Linkedin,
//   Mail,
//   MessageCircle,
//   Send,
//   Sparkles,
// } from "lucide-react";

import "./Contact.css";

const contactDetails = [
  {
    icon: Mail,
    label: "Email Me",
    value: "ebadullahabid47@gmail.com",
    href: "mailto:ebadullahabid47@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "Let's Connect",
    value: "Open to meaningful conversations",
    href: "mailto:ebadullahabid47@gmail.com",
  },
];

const socialLinks = [
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/ABID-codesM",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ebadullah-abid-67a6863b3",
  },
];
// const socialLinks = [
//   {
//     icon: Github,
//     label: "GitHub",
//     href: "https://github.com/ABID-codesM",
//   },
//   {
//     icon: Linkedin,
//     label: "LinkedIn",
//     href: "https://www.linkedin.com/in/ebadullah-abid-67a6863b3",
//   },
// ];

const initialForm = {
  fullName: "",
  email: "",
  subject: "",
  projectType: "",
  message: "",
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend preview only.
    // Email delivery will be connected through the backend later.
    setSubmitted(true);
    setFormData(initialForm);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-background">
        <div className="contact-glow contact-glow-one" />
        <div className="contact-glow contact-glow-two" />
        <div className="contact-grid" />
      </div>

      <div className="contact-container">
        {/* Section Heading */}
        <motion.div
          className="contact-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <span className="contact-eyebrow">
            <Sparkles size={15} />
            GET IN TOUCH
          </span>

          <h2>
            Have a Project
            <span> in Mind?</span>
          </h2>

          <p>
            Every great solution starts with a conversation. Let's discuss your
            ideas and explore how we can turn them into something meaningful.
          </p>
        </motion.div>

        {/* Main Contact Layout */}
        <div className="contact-layout">
          {/* Left Side */}
          <motion.div
            className="contact-info"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="contact-info-card">
              <div className="contact-info-top">
                <span className="contact-small-label">
                  LET'S START SOMETHING
                </span>

                <div className="contact-icon-main">
                  <MessageCircle size={27} />
                </div>
              </div>

              <h3>
                Let's turn your
                <span> idea into reality.</span>
              </h3>

              <p>
                Whether you have a project in mind, need a reliable development
                partner, or simply want to connect, I'd be glad to hear from
                you.
              </p>

              <div className="contact-availability">
                <span className="availability-indicator" />
                Open to meaningful opportunities
              </div>
            </div>

            <div className="contact-details">
              {contactDetails.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    href={item.href}
                    className="contact-detail-item"
                    key={item.label}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="contact-detail-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <span>{item.label}</span>
                      <p>{item.value}</p>
                    </div>

                    <ArrowUpRight className="contact-detail-arrow" size={18} />
                  </motion.a>
                );
              })}
            </div>

            <div className="contact-social">
              <span>FIND ME ON</span>
              <div className="contact-social-links">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      href={item.href}
                      key={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  );
                })}
              </div>
              {/* <div className="contact-social-links">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      href={item.href}
                      key={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  );
                })}
              </div> */}
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            className="contact-form-wrapper"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="contact-form-header">
              <div>
                <span className="contact-small-label">SEND A MESSAGE</span>

                <h3>Tell me about your project.</h3>
              </div>

              <div className="form-header-icon">
                <Send size={21} />
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span>*</span>
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject <span>*</span>
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What would you like to discuss?"
                  value={formData.subject}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={120}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectType">
                  Project Type <span>*</span>
                </label>

                <div className="select-wrapper">
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a project type
                    </option>

                    <option value="Full-Stack Web Application">
                      Full-Stack Web Application
                    </option>

                    <option value="Frontend Development">
                      Frontend Development
                    </option>

                    <option value="Backend Development">
                      Backend Development
                    </option>

                    <option value="Business Management System">
                      Business Management System
                    </option>

                    <option value="API Development">API Development</option>

                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Your Message <span>*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me a little about your idea, goals, or project..."
                  value={formData.message}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                <span>Send Message</span>
                <Send size={17} />
              </button>

              {submitted && (
                <div className="contact-form-notice" role="status">
                  <CheckCircle2 size={19} />

                  <p>
                    Your form preview is working successfully. Email delivery
                    will be enabled when the backend is connected.
                  </p>
                </div>
              )}

              <p className="contact-form-note">
                <span>*</span> Required fields
              </p>
            </form>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="contact-bottom"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="contact-bottom-text">
            <span>HAVE SOMETHING INTERESTING IN MIND?</span>
            <h3>Let's build something that matters.</h3>
          </div>

          <a
            href="mailto:ebadullahabid47@gmail.com"
            className="contact-bottom-link"
          >
            Start a Conversation
            <ArrowUpRight size={19} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
