var request = require("request");
var Push = require("../Push.js");
var async = require("async");

var push= new Push("A6985431369648","DEE7DB7E-CB5F-63D3-962E-C0F40107028B");

push.message({
	title:"test",
	content:"没有什么能够阻挡",
	type:1,
	platform:0
},function(ret,err){
	console.log(ret,err)
})