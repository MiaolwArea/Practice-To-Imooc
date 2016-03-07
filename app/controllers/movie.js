var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

//detail page
exports.detail = function(req, res){
	var id = req.params.id

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
		if(err){
			console.log(err);
		}
	})
	Movie.findById(id, function(err, movie){
		Comment
		.find({movie: id})
		.populate('from')
		.populate('reply.from reply.to')
		.exec(function(err, comments){
			res.render('detail', {
				title: 'imooc 详情页',
				movie: movie,
				comments: comments
			})
		})
	})
}
//admin new page
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: 'imooc 后台录入页',
			categories: categories,
			movie: {}
		})
	})
}

// admin update movie
exports.update = function(req, res){
	var id = req.params.id

	if(id){
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('admin',{
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

// admin poster
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename

	if(originalFilename){
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)	// __dirname表示当前操作的此文件的路径
			
			fs.writeFile(newPath, data, function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

// admin poster movie
exports.save = function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(req.poster){
		movieObj.poster = req.poster
	}
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie, movieObj) // 更新过的字段替换老数据，第一个参数是查询的数据，第二个是提交的数据
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		_movie = new Movie(movieObj)
		var categoryId = movieObj.category,
			categoryName = movieObj.categoryName
		_movie.save(function(err, movie){
			if(err){
				console.log(err)
			}
			if(categoryId){
				Category.findById(categoryId, function(err, category) {
					category.movies.push(_movie._id)
					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id)
					})
				})
			}else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function(err, category) {
					movie.category = category._id
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id)
					})
				})
			}
		})
	}
}

//list page
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	});
}

//list delete movie
exports.del = function(req, res){
	var id = req.query.id

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1})
			}
		})
	}
}