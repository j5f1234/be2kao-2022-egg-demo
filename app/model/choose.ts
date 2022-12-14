import {Model, INTEGER,DATE} from 'sequelize'
import { Application } from 'egg'

class Choose extends Model {
	id: number
	busId: number
  userId: number
  day: number
  time: number
	readonly updatedAt: Date
	readonly createdAt: Date

	static associate: () => any
}

export default ( app: Application) =>{
	Choose.init({
		id: {type: INTEGER, primaryKey: true, autoIncrement: true},
		busId: INTEGER,
		userId: INTEGER,
		day: INTEGER,
		time: INTEGER,
    updatedAt: DATE,
    createdAt: DATE
	}, {
		sequelize: app.model,
		modelName: 'chooses',
		underscored: true
	})
	Choose.associate = ()=>{
		app.model.Choose.belongsTo(app.model.Bus, {foreignKey: 'busId', as: 'bus'})
		app.model.Choose.belongsTo(app.model.User, {foreignKey: 'userId', as: 'user'})
	}

	return Choose
}