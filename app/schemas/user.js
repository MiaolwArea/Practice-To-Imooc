var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');// 密码加密算法模块
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	/*
	0: nomal user
	1: verified user
	2: professonal user
	>10: admin
	>50: super admin
	*/
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
//每次在存储数据之前都会调用pre这个方法,next是让存储流程继续执行下去
UserSchema.pre('save', function(next){
	var user = this
	
	if(this.isnew){
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if (err) return next(err)
			bcrypt.hash(user.password, null, null, function(err, hash){
				if (err) return next(err)
				user.password = hash
				next()
			})
	}) //生成随机的盐,第一个参数是计算强度,越大越难，第二个是返回盐
})
// 实例方法，通过别地方的实例化之后可以调用的方法
UserSchema.methods = {
	comparePassword: function(_password, cd){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) return cd(err)
			cd(null, isMatch)
		})
	}
}
UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)	//执行回调
	},
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb)	
	}
}
// 将模式导出
module.exports = UserSchema

