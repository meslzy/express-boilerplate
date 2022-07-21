import Http from "http";

import Application from "@server/application";
import Database from "@server/database";
import Socket from "@server/socket";

class Server extends Http.Server {
	application: Application;
	database: Database;
	socket: Socket;

	constructor() {
		super();

		this.on("listening", () => {
			return logger.info(`Listening on http://localhost:${config.server.port} with ${config.mode} mode`);
		});
	}

	public init = () => {
		this.application = new Application();
		global.application = this.application;

		this.database = new Database();
		global.database = this.database;

		this.socket = new Socket();
		global.socket = this.socket;

		return Promise.all([
			this.application.init(),
			this.database.init(),
			this.socket.init()
		]);
	};

	public start = () => {
		return this.listen(config.server.port);
	};
}

export default Server;
