export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public errors?: any
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = "Unauthorized access") {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = "Forbidden access") {
        super(message, 403);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = "Bad request") {
        super(message, 400);
    }
}
