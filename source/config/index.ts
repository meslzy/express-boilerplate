import * as path from "path";

class Config {
	mode: "development" | "production";

	server: {
		port: string;
	};

	database: {
		name: string;
		port: string;

		user: string;
		pass: string;
	};

	logs: {
		path: string;
	};

	constructor() {
		const dev = process.env["NODE_ENV"] !== "production";

		if (dev) {
			this.mode = "development";
		} else {
			this.mode = "production";
		}

		this.server = {
			port: dev ? "5000" : process.env["DATABASE_PORT"] ?? "5000",
		};

		this.database = {
			name: dev ? "postgres" : process.env["DATABASE_NAME"] ?? "postgres",
			port: dev ? "5432" : process.env["DATABASE_PORT"] ?? "5432",

			user: dev ? "postgres" : process.env["DATABASE_USER"] ?? "postgres",
			pass: dev ? "0103" : process.env["DATABASE_PASS"] ?? "0103",
		};

		this.logs = {
			path: path.join(process.cwd(), "logs"),
		};
	}
}

export default Config;
