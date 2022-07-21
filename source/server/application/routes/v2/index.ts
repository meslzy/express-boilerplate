import Express from "express";

const router = Express.Router();

router.use((request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
	request.version = "v2";
	return next();
});

router.all("/", (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
	return response.json({
		message: request.version,
	});
});

export default router;
