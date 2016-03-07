//1、建立Schema模式
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
	name: String,
	movies: [{type: ObjectId, ref: 'Movie'}],
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
CategorySchema.pre('save', function(next){
	if(this.isnew){
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})
// 静态方法不会直接与数据库交互，只有经过Model编译进行实例化以后才会具有这个方法;fetch用于取出目前数据库所有的数据,findById用于单条数据查询
CategorySchema.statics = {
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
module.exports = CategorySchema

