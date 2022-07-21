import Config from "@/config";
import Logger from "@/logger";

import Server from "@/server";
import Application from "@server/application";
import Database from "@server/database";
import Socket from "@server/socket";

declare global {
	var config: Config;
	var logger: Logger;

	var server: Server;
	var application: Application;
	var database: Database;
	var socket: Socket;

	declare namespace Express {
		interface Request {
			version: "v1" | "v2";
		}
	}
}
