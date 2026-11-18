const allowedProjectTypes = [
  "Full-Stack Web Application",
  "Frontend Development",
  "Backend Development",
  "Business Management System",
  "API Development",
  "Other",
];

export const validateContact = (data) => {
  const errors = {};

  // Ensure request body is a valid object
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      isValid: false,
      errors: {
        general: "Invalid request data.",
      },
      sanitizedData: null,
    };
  }

  // Safely normalize string values
  const getString = (value) => (typeof value === "string" ? value.trim() : "");

  const fullName = getString(data.fullName);
  const email = getString(data.email);
  const subject = getString(data.subject);
  const projectType = getString(data.projectType);
  const message = getString(data.message);

  // Full Name
  if (fullName.length < 2) {
    errors.fullName = "Name must contain at least 2 characters.";
  } else if (fullName.length > 80) {
    errors.fullName = "Name cannot exceed 80 characters.";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.length > 254 || !emailRegex.test(email)) {
    errors.email = "Please provide a valid email address.";
  }

  // Subject
  if (subject.length < 3) {
    errors.subject = "Subject must contain at least 3 characters.";
  } else if (subject.length > 120) {
    errors.subject = "Subject cannot exceed 120 characters.";
  }

  // Project Type
  if (!allowedProjectTypes.includes(projectType)) {
    errors.projectType = "Please select a valid project type.";
  }

  // Message
  if (message.length < 10) {
    errors.message = "Message must contain at least 10 characters.";
  } else if (message.length > 3000) {
    errors.message = "Message cannot exceed 3000 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,

    sanitizedData: {
      fullName,
      email,
      subject,
      projectType,
      message,
    },
  };
};
