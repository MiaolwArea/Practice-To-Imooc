var crypto = require('crypto') // 密码生成
var bcrypt = require('bcrypt') // 密码加密

// 获取随机字符串，用来测试user时候 有个名字
function getRandomString(len){
	if(!len) len = 16

	return crypto.randomBytes(Math.ceil(len / 2)).toString('hex') // 生成随机字符串
}

var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
// var User = require('../../app/models/user')
var User = mongoose.model('User')
var user

// test
// 用来描述一个单元测试开始,可嵌套的，一个测试模块可以有子测试模块,测试从before的done开始,一个it就是一个测试用例，其里面done只调用一次
describe('<Unit Test', function(){
	describe('Models User:', function(){
		before(function(done){
			user = {
				name: getRandomString(),
				password: 'password'
			}
			done()
		})
		// 下面用例先确定user.name在数据库中是不存在的
		describe('Before Method save:', function(){
			it('should begin without test user', function(done){
				User.find({name: user.name}, function(err, users){
					users.should.have.length(0) 

					done()
				})
			})
		})
		// 用户save的时候不要出问题
		describe('User save:', function(){
			it('should save without problems', function(done){
				var _user = new User(user)

				_user.save(function(err){
					should.not.exist(err) 
					// 删除，避免后面调用的时候重复
					_user.remove(function(err){
						should.not.exist(err) 
						done()
					}) 
				})
			})
			// user在new的时候有密码的生成，确定密码生成没有问题
			it('should password be hashed correctly', function(done){
				var password = user.password 
				var _user = new User(user)

				_user.save(function(err){
					should.not.exist(err) 
					_user.password.should.not.have.length(0)
					// 比对
					bcrypt.compare(password, _user.password, function(err, isMatch){
						should.not.exist(err) 
						isMatch.should.equal(true)
						 
						_user.remove(function(err){
							should.not.exist(err) 
							done()
						}) 
					}) 
				})
			})
			// 让用户权限是默认的0
			it('should have default role 0', function(done){
				var _user = new User(user)

				_user.save(function(err){
					_user.role.should.equal(0)
					
					_user.remove(function(err){
						done()
					})
				})
			})
			// 用户重名情况
			it('should fail to save an existing user', function(done){
				var _user1 = new User(user)
				_user1.save(function(){
					should.not.exist(err)

					var _user2 = new User(user)
					_user2.save(function(err){
						should.exist(err)

						_user1.remove(function(err){
							if(!err){
								_user2.remove(function(err){
									done()
								})
							}
						})
					})
				})
			})
		})
		after(function(done){
			// clean user info
			done()
		})
	})
})