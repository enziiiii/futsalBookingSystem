class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // sets error name (e.g., "AppError")
        this.isOperational = true; // Differ operational vs programmer errors
        Error.captureStackTrace(this, this.constructor); 
    }
}

class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}

class UserAlreadyExistsError extends AppError {
    constructor(message = "User already exists") {
        super(message, 409);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Permissions not allowed") {
        super( message, 403);
    }
}

// Database Error
class InternalServerError extends AppError {
    constructor(message, originalError) {
        super(message, 500); // Default to 500 status code
        this.originalError = originalError; // capture the original DB error
    }
}
 
const CustomErrors = {
    AppError,
    ValidationError,
    UserAlreadyExistsError,
    UnauthorizedError,
    NotFoundError,
    ForbiddenError,
    InternalServerError
};

module.exports = CustomErrors;