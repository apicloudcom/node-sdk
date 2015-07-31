var request = require("request");
var Resource = require("../Resource.js");
var async = require("async");
var path = require("path")

var id;
var client=new Resource("A6986290476670","8073AA0E-F22F-9B47-EBCB-8C64A127C298");
// var client=new Resource("A6962135466109","82C711EB-DFB6-1763-5FF4-BCF9F4E2D3D1","http://127.0.0.1:5001/mcm/api");
var f=client.Factory("file");

f.save({
	"file":{
		isFile:true,
    	isFileClass:true,
		path:path.join(__dirname,"/APICloud-rest.js")
	}
},function(ret,err){
	console.log("one",ret,err)
})

var t=client.Factory("testr");
var id;
t.save({
	"file1":{
		isFile:true,
		path:path.join(__dirname,"/APICloud-rest.js")
	},
	"file2":{
		isFile:true,
		path:path.join(__dirname,"/APICloud-rest.js")
	}
},function(ret,err){
	console.log("two",ret,err)
	next(ret.id);
})

function next(id){
	t.save({"_id":id,"_relation":"f"},{"file":{
		isFile:true,
    	isFileClass:true,
		path:path.join(__dirname,"/APICloud-rest.js")
	}},function(ret,err){
		console.log("three",ret,err)
	})
}