export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested API endpoint was not found.",
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error("Server Error:", error);

  // Malformed JSON
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  // Request Body Too Large
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
  }

  // Forbidden Origin
  if (error.message === "Origin not allowed by CORS.") {
    return res.status(403).json({
      success: false,
      message: "This origin is not allowed.",
    });
  }

  // General Server Error
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error.message || "Something went wrong.",
  });
};
