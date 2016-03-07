var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req, res){
	Category
		.find({})
		.populate({path: 'movies', select: 'title poster', option: {limit: 6}})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			res.render('index', {
				title: 'imooc 首页',
				categories: categories
			})
		})
}
// search page
exports.search = function(req, res){
	var catId = req.query.cat,
		q = req.query.q,
		page = parseInt(req.query.p, 10) || 0,
		count = 2,
		index = page * count
	if(catId){
		Category
			.find({_id: catId})
			.populate({path: 'movies',  select: 'title poster'}) // option: {limit: 2, skip: index},limit限制每次查询的个数以及要从哪条数据开始查
			.exec(function(err, categories){
				if(err){
					console.log(err);
				}
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + count)
				res.render('results', {
					title: 'imooc 结果列表页',
					keyword: category.name,
					currentPage: (page + 1),
					query: 'cat=' + catId,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	}else{
		Movie
			.find({title: new RegExp(q + '.*', 'i')})
			.exec(function(err, movies){
				if(err){
					console.log(err);
				}
				var results = movies.slice(index, index + count)
				res.render('results', {
					title: 'imooc 结果列表页',
					keyword: q,
					currentPage: (page + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	}
}