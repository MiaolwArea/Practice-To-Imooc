var User = require('../models/user') 

// sign
exports.showSignup = function(req, res){
	res.render('signup',{
		title: '注册页面'
	})
}
exports.showSignin = function(req, res){
	res.render('signin',{
		title: '登入页面'
	})
}
// signup
exports.signup = function(req, res){
	var _user = req.body.user // 因为bodyParser的原因得到的不会是数组，而是对象

	User.findOne({name: _user.name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/signin')
		}else{
			var user = new User(_user)
			user.save(function(err, user){
				if(err){
					console.log(err);
				}
				res.redirect('/')
			})
		}
	})
}
// signin
exports.signin = function(req, res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup')
		}
		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				req.session.user = user //状态记录
				return res.redirect('/')
			}else{
				return res.redirect('/signin')
			}
		})
	})
}
// logout
exports.logout = function(req, res){
	delete req.session.user
	res.redirect('/')
}
// userlist page
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title: 'imooc 用户列表页',
			users: users
		})
	});
}
// midware for user,next就是这个中间件流程走完顺序走到下一个
exports.signinRequired = function(req, res, next){
	var user = req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user
	if(user.role <= 10){
		return res.redirect('/signin')
	}
	next()
}