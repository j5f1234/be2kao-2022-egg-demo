import { Controller } from 'egg';

export default class BusController extends Controller {
  public async busChoose() {
    const { ctx } = this
		try{
			ctx.validate({
				busId: 'number',
				day: 'number',
				time: 'number'
			})
		} catch(e) {
			ctx.body = {
				success: false,
				error: '参数错误'
			}
			return
		}

		const{busId,day,time} = ctx.request.body
		let isChoose = await ctx.model.Choose.findOne({
			where: {userId: ctx.session.id,day:day,time:time}
		})
		let isBus = await ctx.model.Bus.findOne({
			where: {id: busId}
		})
		if (isBus){
			if (isBus.day != null && isBus.time != null && isBus.number != null && isBus.capacity != null){
				if (isBus.capacity >= isBus.number+1) {
					if (isChoose){
						ctx.body = {
							success: false,
							error: '你在该时间段已经有要乘的车辆'
						}
					}
					else {
						if (isBus.day == day && isBus.time == time){
							ctx.model.Choose.create({
								userId: ctx.session.id,
								busId: busId,
								day:day,
								time:time
							})
							ctx.model.Bus.increment('number', {by:1, where: {id: busId}})
							ctx.body = {
								success:true
							}
						}
						else{
							ctx.body = {
								success: false,
								error: '车辆信息错误'
							}
						}
					}
				}
				else {
					ctx.body = {
						success: false,
						error: '该车人数已满'
					}
				}
			}
			else {
				ctx.body = {
					success: false,
					error: '该车辆信息不完整，暂不能选'
				}
			}
		}
		else {
			ctx.body = {
				success: false,
				error: '该车辆不存在'
			}
		}
  }

	public async busDropOut() {
		const {ctx} = this
		const {id} = ctx.params
		if (id != null){			
			let id2 = parseInt(id)
			let isChoose = await ctx.model.Choose.findOne({where: {id: id2, userId: ctx.session.id}})
			if (isChoose) {
				ctx.model.Bus.decrement('number',{by:1,where: {id: isChoose.busId}})
				ctx.model.Choose.destroy({where: {id: id2}})
				ctx.body = {
					success: true
				}
			}
			else {
				ctx.body = {
					success: false,
					error: '未找到该用户的此次选乘车记录'
				}
			}
		}
		else {
			ctx.body = {
				success: false,
				error: '参数不能为空'
			}
		}
	}

	public async scheduldInfo() {
		const{ctx} = this
		const {page,limit} = ctx.query
		if (page && limit) {
			let page2 = parseInt(page)
			let limit2 = parseInt(limit)
			const data = await ctx.model.Choose.findAndCountAll({
				where: {userId: ctx.session.id},
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

			if(data){
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
