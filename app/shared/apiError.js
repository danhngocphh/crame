class APIError extends Error {
    constructor(message, details, status) {
      super(message);
      this.details = details
      this.status = status;
      Error.captureStackTrace(this, message)
    }
}
  
  module.exports = APIError;