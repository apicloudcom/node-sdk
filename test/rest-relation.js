var request = require("request");
var Resource = require("../Resource.js");
var async = require("async");

var id;
var client=new Resource("A6986290476670","8073AA0E-F22F-9B47-EBCB-8C64A127C298");
// var client=new Resource("A6962135466109","82C711EB-DFB6-1763-5FF4-BCF9F4E2D3D1","http://127.0.0.1:5001/mcm/api");
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
	createRelation:["create",function(cb,result){
		t.save({"_id":result.create,"_relation":"r"},{"other":"beiluo"},function(ret,err){
			cb(null,ret)
		})
	}],
	getRelation:["createRelation",function(cb,result){
		t.get({"_id":result.create,"_relation":"r"},function(ret,err){
			cb(null,ret);
		})
	}],
	countRelation:["getRelation",function(cb,result){
		t.count({"_id":result.create,"_relation":"r"},function(ret,err){
			cb(null,ret);
		})
	}],
	deleteRelation:["countRelation",function(cb,result){
		t.delete({"_id":result.create,"_relation":"r"},function(ret,err){
			cb(null,ret);
		})
	}],
	delete:["deleteRelation",function(cb,result){
		t.delete({"_id":result.create},function(ret,err){
			cb(null,ret)
		})
	}]
},function(err,result){
	console.log(err,result)
})