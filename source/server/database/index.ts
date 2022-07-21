import {Sequelize} from "sequelize";

import tasks, {Task} from "@database/models/tasks.model";

import * as os from "os";

class Database {
	sequelize: Sequelize;

	models: {
		tasks: typeof Task;
	};

	constructor() {
		const {name, user, pass} = config.database;

		this.sequelize = new Sequelize(name, user, pass, {
			dialect: "postgres",
			logging: false,
			pool: {
				max: os.cpus().length,
				min: 0,
			},
		});

		this.models = {
			tasks: tasks(this.sequelize),
		};
	}

	init = () => {
		return this.sequelize.authenticate().then(() => {
			return this.sequelize.sync();
		});
	};
}

export default Database;
