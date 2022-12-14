import {Model, INTEGER,STRING,DATE} from 'sequelize'
import { Application } from 'egg'

class Bus extends Model {
	id: number
	name: string
  day: number
  time: number
  capacity: number
	number: number
	readonly updatedAt: Date
	readonly createdAt: Date

	static associate: () => any
}

export default ( app: Application) =>{
	Bus.init({
		id: {type: INTEGER, primaryKey: true, autoIncrement: true},
		name: STRING,
		day: INTEGER,
		time: INTEGER,
		capacity: INTEGER,
		number: INTEGER,
    updatedAt: DATE,
    createdAt: DATE
	}, {
		sequelize: app.model,
		modelName: 'buses',
		underscored: true
	})

	Bus.associate = ()=>{
		app.model.Bus.hasMany(app.model.Choose, {foreignKey: 'busId', as: 'choose'})
	}

	return Bus 
}