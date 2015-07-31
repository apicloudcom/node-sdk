var crypto = require('crypto');
var request = require("request");

function SHA1(str){
    var sha1 = crypto.createHash('sha1');
        sha1.update(str);
    return sha1.digest('hex');
}

module.exports=Analytics;

function Analytics(appId,appKey,baseurl){
	var now = Date.now();
	this.appId = appId;
    this.baseurl = baseurl || "https://r.apicloud.com/analytics/";
    this.appCode = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now;
}
/*
 * 该接口主要用于获取用户指定应用ID及时间范围内的相关应用统计数据信息。
 * params
 * startDate – 开始时间 格式：YYYY-MM-DD 例如：2014-10-10
 * endDate – 结束时间 格式：YYYY-MM-DD
 */
Analytics.prototype.getAppStatisticDataById = function(startDate,endDate,callback) {
	var options={
		url:this.baseurl+"/getAppStatisticDataById",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			startDate:startDate,
			endDate:endDate
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};

/*
 * 该接口主要用于获取用户指定应用ID及时间范围内相关应用各版本的统计数据信息。
 * params
 * startDate – 开始时间 格式：YYYY-MM-DD 例如：2014-10-10
 * endDate – 结束时间 格式：YYYY-MM-DD
 */
Analytics.prototype.getVersionsStatisticDataById = function(startDate,endDate,callback) {
	var options={
		url:this.baseurl+"/getVersionsStatisticDataById",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			startDate:startDate,
			endDate:endDate
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};

/*
 * 该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本地理分布统计数据信息。
 * params
 * startDate – 开始时间 格式：YYYY-MM-DD 例如：2014-10-10
 * endDate – 结束时间 格式：YYYY-MM-DD
 * versionCode  - 版本
 */
Analytics.prototype.getGeoStatisticDataById = function(startDate,endDate,versionCode,callback) {
	if(typeof versionCode === 'function') callback=versionCode;
	var options={
		url:this.baseurl+"/getGeoStatisticDataById",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			startDate:startDate,
			endDate:endDate,
			versionCode:versionCode
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};

/*
 * 该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本设备信息分布统计数据信息。
 * params
 * startDate – 开始时间 格式：YYYY-MM-DD 例如：2014-10-10
 * endDate – 结束时间 格式：YYYY-MM-DD
 */
Analytics.prototype.getDeviceStatisticDataById = function(startDate,endDate,callback) {
	var options={
		url:this.baseurl+"/getDeviceStatisticDataById",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			startDate:startDate,
			endDate:endDate
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};

/*
 * 该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本异常错误统计数据信息。
 * params
 * startDate – 开始时间 格式：YYYY-MM-DD 例如：2014-10-10
 * endDate – 结束时间 格式：YYYY-MM-DD
 */
Analytics.prototype.getExceptionsStatisticDataById = function(startDate,endDate,callback) {
	var options={
		url:this.baseurl+"/getExceptionsStatisticDataById",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			startDate:startDate,
			endDate:endDate
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};

/*
 * 该接口主要用于根据应用异常错误摘要获取异常错误详细信息
 * params
 * title – 错误摘要信息
 */
Analytics.prototype.getExceptionsDetailByTitle = function(title,callback) {
	var options={
		url:this.baseurl+"/getExceptionsDetailByTitle",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:{
			title:title
		}
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
};