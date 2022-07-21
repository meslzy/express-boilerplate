import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	ModelAttributes,
} from "sequelize";

export class Task extends Model<
	InferAttributes<Task>,
	InferCreationAttributes<Task>
> {
	declare id: CreationOptional<number>;

	declare title: string;
	declare description: string;

	declare done: boolean;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

const attributes: ModelAttributes<Task, InferAttributes<Task>> = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	done: {
		type: new DataTypes.BOOLEAN(),
		allowNull: false,
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
};

export default (sequelize) =>
	Task.init(attributes, {
		sequelize,
		tableName: "tasks",
	});
