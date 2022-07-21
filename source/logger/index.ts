import Winston from "winston";

import cluster from "cluster";
import path from "path";

class Logger {
	winston: Winston.Logger;

	private transports = () => {
		const consoleTransport = new Winston.transports.Console();

		if (config.mode === "development") return [
			consoleTransport,
		];

		const fileTransport = new Winston.transports.File({
			filename: path.join(config.logs.path, "logs.log"),
		});

		return [
			consoleTransport, fileTransport,
		];
	};

	private format = () => {
		return Winston.format.combine(
			Winston.format.colorize(),
			Winston.format.timestamp(),
			Winston.format.label({
				label: cluster.isPrimary ? "Primary Cluster" : `Worker Cluster ${process.pid}`
			}),
			Winston.format.printf((info) => {
				return `${info["timestamp"]} ${info["label"]} | ${info["level"]}: ${info["message"]}`;
			}),
		);
	};

	constructor() {
		this.winston = Winston.createLogger({
			transports: this.transports(),
			format: this.format(),
			exitOnError: true,
		});
	}

	info = (message: any, ...meta: any[]) => {
		return this.winston.info(message, ...meta);
	};

	warning = (message: any, ...meta: any[]) => {
		return this.winston.warning(message, ...meta);
	};

	error = (message: any, ...meta: any[]) => {
		return this.winston.error(message, ...meta);
	};
}

export default Logger;
