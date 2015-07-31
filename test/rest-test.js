var request = require("request");
var Resource = require("../Resource.js");
var async = require("async");

var id;
var client=new Resource("A6986290476670","8073AA0E-F22F-9B47-EBCB-8C64A127C298");
var t=client.Factory("test");

async.auto({
	create:function(cb){
		t.save({"str":"APICloud-rest"},function(ret,err){
			if(ret.id){
				cb(null,ret.id)
			}else{
				cb(ret||err,null)
			}
		})
	},
	get:["create",function(cb,result){
		t.get({"_id":result.create},function(ret,err){
			cb(null,ret);
		})
	}],
	count:["get",function(cb,result){
		t.count(function(ret,err){
			cb(null,ret);
		})
	}],
	exists:["count",function(cb,result){
		t.exists({"_id":result.create},function(ret,err){
			cb(null,ret);
		})
	}],
	findOne:["exists",function(cb,result){
		t.findOne(function(ret,err){
			cb(null,ret);
		})
	}],
	update:["findOne",function(cb,result){
		t.save({"_id":result.create},{"str":"APICloud"},function(ret,err){
			cb(null,ret);
		})
	}],
	query:["update",function(cb){
		t.query(function(ret,err){
			cb(null,ret)
		})
	}],
	delete:["query",function(cb,result){
		t.delete({"_id":result.create},function(ret,err){
			cb(null,ret)
		})
	}]
},function(err,result){
	console.log(err,result)
})