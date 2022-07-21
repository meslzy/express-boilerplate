import Express from "express";

export class RequestError extends Error {
	status: number;

	constructor(message: string, status: number = 500) {
		super(message);
		this.status = status;
	}
}

const loggerHandler = (error: RequestError, request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
	logger.error(error.stack);
	return next(error);
};

const requestHandler = (error: RequestError, request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
	if (error.status) return response.status(error.status).json({
		error: error.message
	});

	return response.status(500).json({
		error: error.message
	});
};

const safeHandler = (error: RequestError, request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
	return response.status(500).send(error);
};

export default {
	loggerHandler, requestHandler, safeHandler
};
