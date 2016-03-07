// 建立Model模型
var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie') //模式文件的引入
var Movie = mongoose.model('Movie',MovieSchema) //编译生成Movie模型

module.exports = Movie
