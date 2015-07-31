var request = require("request");
var Resource = require("../Resource.js");
var async = require("async");

var id;
var client=new Resource("A6986290476670","8073AA0E-F22F-9B47-EBCB-8C64A127C298");
// var client=new Resource("A6962135466109","82C711EB-DFB6-1763-5FF4-BCF9F4E2D3D1","http://127.0.0.1:5001/mcm/api");
var u=client.Factory("user");

async.auto({
	create:function(cb){
		u.save({"username":"beiluo","password":"111111"},function(ret,err){
			cb(null,ret)
		})
	},
	login:function(cb){
		u.login({"username":"beiluo","password":"111111"},function(ret,err){
			if(ret.id){
				client.setHeaders("authorization",ret.id)
			}
			cb(null,ret)
		})
	},
	update:["login",function(cb,result){
		u.save({"_id":result.create.id},{"password":"222222"},function(ret,err){
			cb(null,ret);
		})
	}],
	delete:["update",function(cb,result){
		u.delete({"_id":result.create.id},function(ret,err){
			cb(null,ret)
		})
	}],
	logout:["delete",function(cb,result){
		u.logout(,function(ret,err){
			cb(null,ret)
		})
	}]
},function(err,result){
	console.log(err,result)
})