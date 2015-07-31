var request = require("request");
var Resource = require("../Resource.js");
var async = require("async");

var id;
var client=new Resource("A6986290476670","8073AA0E-F22F-9B47-EBCB-8C64A127C298");

client.batch([
	{
		method:"GET",
		path:"/mcm/api/file"
	},
	{
		method:"GET",
		path:"/mcm/api/file/count"
	}
],function(ret,err){
	console.log(ret,err);
})