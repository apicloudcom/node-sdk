var request = require("request");
var Analytics = require("../Analytics.js");
var async = require("async");

var Analytics= new Analytics("A6985431369648","DEE7DB7E-CB5F-63D3-962E-C0F40107028B");

Analytics.getAppStatisticDataById("2015-05-22","2015-05-28",function(ret,err){
	console.log("1",ret,err)
})

Analytics.getVersionsStatisticDataById("2015-05-22","2015-05-28",function(ret,err){
	console.log("2",ret,err)
})

Analytics.getGeoStatisticDataById("2015-05-22","2015-05-28",function(ret,err){
	console.log("3",ret,err)
})

Analytics.getDeviceStatisticDataById("2015-05-22","2015-05-28",function(ret,err){
	console.log("4",ret,err)
})

Analytics.getExceptionsStatisticDataById("2015-05-22","2015-05-28",function(ret,err){
	console.log("5",ret,err)
})

Analytics.getExceptionsDetailByTitle("NullPointerException[com.uzmap.pkg.uzmodules.uzScanner.Zxing.CaptureActivity.java,onActivityResult,180]",function(ret,err){
	console.log("6",ret,err)
})