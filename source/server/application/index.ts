import Express from "express";

import cookieParser from "cookie-parser";
import compression from "compression";
import nocache from "nocache";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import router from "@application/routes";
import errors from "@application/utils/errors";

import * as path from "path";

class Application {
	express: Express.Application;

	constructor() {
		this.express = Express();
	}

	private default = () => {
		this.express.set("trust proxy", 1);
		this.express.set("x-powered-by", false);
	};

	private middleware = () => {
		// Built-in middleware
		this.express.use(Express.json());
		this.express.use(Express.urlencoded({extended: true}));
		this.express.use(Express.static(path.join(process.cwd(), "public")));

		// Third-party middleware
		this.express.use(cookieParser());
		this.express.use(compression());
		this.express.use(nocache());
		this.express.use(helmet());
		this.express.use(cors());

		if (config.mode === "development") {
			this.express.use(
				morgan("dev", {
					stream: {
						write: (message: string) => {
							return logger.info(message);
						}
					}
				})
			);
		} else {
			this.express.use(
				morgan("combined", {
					stream: {
						write: (message: string) => {
							return logger.info(message);
						}
					}
				})
			);
		}
	};

	private routers = () => {
		this.express.use("/v1/", router.v1);
		this.express.use("/v2/", router.v2);
	};

	private errors = () => {
		this.express.use(errors.loggerHandler);
		this.express.use(errors.requestHandler);
		this.express.use(errors.safeHandler);
	};

	init = async () => {
		server.on("request", this.express);

		this.default();
		this.middleware();
		this.routers();
		this.errors();
	};
}

export default Application;
