class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, message);
  }
}

module.exports = APIError;
