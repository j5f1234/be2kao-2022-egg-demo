import { Controller } from 'egg';

export default class AdminController extends Controller {
  public async addBus() {
    const { ctx } = this;
		try {
			ctx.validate({
				name: 'string',
				capacity: 'number',
				day: 'number',
				time: 'number'
			})
		} catch(e){
      ctx.body = {
        success: false,
        error: '参数错误'
      }
      return
    }

		const {name,capacity,day,time} = ctx.request.body
		let bus = await ctx.model.Bus.create({name:name,capacity: capacity,number:0,day:day,time:time})
		ctx.body = {
			success: true,
			data: {
				id: bus.id
			}
		}
  }

	public async deleteBus() {
		const {ctx} = this
		const {id} = ctx.params
		if (id){
			let id2 = parseInt(id)
			let isBus = await ctx.model.Bus.findByPk(id2)
			if (isBus){
				ctx.model.Bus.destroy({where: {id: id2}})
				ctx.body = {
					success: true
				}
			} 
			else {
				ctx.body = {
					success: false,
					error: '该车辆不存在'
				}
			}
		}
		else {
			ctx.body = {
				success: false,
				error: '参数错误'
			}
		}
	}

	public async changeBusInfo(){
		const {ctx} = this
		try {
			ctx.validate({
				id: 'number',
			})
		} catch(e){
				ctx.body = {
					success: false,
					error: '参数错误'
				}
			return
		}

		const {id,name,capacity,number,day,time} = ctx.request.body

		let bus = await ctx.model.Bus.findByPk(id)
		if(bus){
			if (name || capacity || number || day || time){
				if (name != null){
					if (typeof name == 'string'){
						bus.name = name
						ctx.body = {
							success: true,
						}
					}
					else {
						ctx.body = {
							success: false,
							error: 'name参数类型错误'
						}
						return
					}
				}		

				if (capacity != null){
					if (typeof capacity == 'number'){
						bus.capacity = capacity
						ctx.body = {
							success: true
						}
					}
					else {
						ctx.body = {
							success: false,
							error: 'capacity参数类型错误'
						}
						return
					}
				}

				if (number != null){
					if (typeof number == 'number'){
						bus.number = number
						ctx.body = {
							success: true
						}
					}
					else {
						ctx.body = {
							success: false,
							error: 'number参数类型错误'
						}
						return
					}
				}

				if (day != null){
					if (typeof day == 'number' && day <= 5 && day >= 1){
						bus.day = day
						ctx.body = {
							success: true
						}
					}
					else{
						ctx.body = {
							success: false,
							error: 'day参数类型错误或超出范围(1-5)'
						}
						return
					}
				}
				if (time != null){
					if (typeof time == 'number' && time <= 3 && time >= 1){
						bus.time = time
						ctx.body = {
							success: true
						}
					}
					else{ 
						ctx.body = {
							success: false,
							error: 'time参数类型错误或超出范围（1-3）'
						}
						return
					}
				}
				bus.save()
			}
			else {
				ctx.body = {
					success: false,
					error: '要修改的参数不能为空'
				}
			}
		}
		else {
			ctx.body = {
				success: false,
				error: '车辆不存在'
			}
		}
	}

	public async userList() {
		const {ctx} = this
		const {page,limit} = ctx.query
		if (page || limit){
			let page2 = parseInt(page)
			let limit2 = parseInt(limit)
			const data = await ctx.model.User.findAndCountAll({
				limit: limit2,
				offset: (page2-1) * limit2
			})
			ctx.body = {
				success: true,
				data: {
					total: data.count,
					list: data.rows
				}
			}
		} 
		else {
			ctx.body = {
				success: false,
				error: '参数错误'
			}
		}

	}

	public async userScheduldInfo() {
		const{ctx} = this
		const {userId,page,limit} = ctx.query
		if (userId && page && limit) {
			let userId2 = parseInt(userId)
			let page2 = parseInt(page)
			let limit2 = parseInt(limit)
			const data = await ctx.model.Choose.findAndCountAll({
				where: {userId: userId2},
				attributes: ['id'],
				limit: limit2,
				offset: (page2-1) * limit2,
				include: [{
					model: ctx.model.Bus,
					as: 'bus',
					attributes: ['id','name','day','time','capacity','number'],
					required: false
				}] 
			})

			if(data.count != 0){
				ctx.body = {
					success: true,
					data: {
						total: data.count,
						list: data.rows
					}
				}
			}
			else {
				ctx.body = {
					success: false,
					error: '未查到选乘车记录'
				}
			}
		}
		else{
			ctx.body = {
				success: false,
				error: '参数错误'
			}
		}
	}

	public async busScheduleInfo() {
		const {ctx} = this
		const {busId,page,limit} = ctx.query
		if (busId && page && limit) {
			let busId2 = parseInt(busId)
			let page2 = parseInt(page)
			let limit2 = parseInt(limit)
			const data = await ctx.model.Choose.findAndCountAll({
				where: {busId: busId2},
				attributes: ['id','busId','userId'],
				limit: limit2,
				offset: (page2-1) * limit2,
				include: [{
					model: ctx.model.User,
					as: 'user',
					attributes: ['number','name'],
					required: false
				}] 
			})

			if(data.count != 0){
				ctx.body = {
					success: true,
					data: {
						total: data.count,
						list: data.rows
					}
				}
			}
			else {
				ctx.body = {
					success: false,
					error: '未查到选乘车记录'
				}
			}
		}
		else{
			ctx.body = {
				success: false,
				error: '参数错误'
			}
		}
	}
}
