import "module-alias/register";

import cluster from "cluster";
import os from "os";

import Logger from "@/logger";
import Config from "@/config";

import Server from "@/server";

import Sequelize from "sequelize";

const config = new Config();
global.config = config;

const logger = new Logger();
global.logger = logger;

const primary = () => {
	const cpus = os.cpus();

	logger.info(`Found ${cpus.length} CPUs`);

	cluster.on("listening", (worker) => {
		logger.info(`Worker ${worker.id} ${worker.process.pid} is listening`);
	});

	cluster.on("exit", (worker, code) => {
		logger.info(`Worker ${worker.id} ${worker.process.pid} exited`);
		if (code === 0 && worker.exitedAfterDisconnect) cluster.fork();
	});

	if (config.mode === "development") {
		return cluster.fork();
	}

	return cpus.forEach(() => cluster.fork());
};

const worker = () => {
	const server = new Server();
	global.server = server;

	server.init().then(() => {
		return server.start();
	}).catch((error: unknown) => {
		if (error instanceof Sequelize.ConnectionError) {
			logger.error(`Sequelize connection error: ${error.message}`);
			return process.exit(1);
		}

		if (error instanceof Error) {
			logger.error(error.message);
			return process.exit(1);
		}

		logger.error(error);
		return process.exit(1);
	});
};

if (cluster.isPrimary) {
	primary();
}

if (cluster.isWorker) {
	worker();
}

process.on("uncaughtException", (error: Error) => {
	logger.error(`${error.name} : ${error.message} \n ${error.stack}`);
});

process.on("warning", (warning: Error) => {
	logger.warning(`${warning.name} : ${warning.message} \n ${warning.stack}`);
});
