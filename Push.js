var crypto = require('crypto');
var request = require("request");

function SHA1(str){
    var sha1 = crypto.createHash('sha1');
        sha1.update(str);
    return sha1.digest('hex');
}

module.exports= Push;

function Push(appId,appKey,baseurl){
	var now = Date.now();
	this.appId = appId;
    this.baseurl = baseurl || "https://p.apicloud.com/api/push";
    this.appCode = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now;
}
/*
 * body
 *	 title–消息标题，
 *	 content – 消息内容
 *	 type – 消息类型，1:消息 2:通知
 *	 timer – 定时消息发送时间。定时不为空则为定时消息，毫秒数。可选参数。
 *	 platform - 0:全部平台，1：ios, 2：android
 *	 groupName - 推送组名，多个组用英文逗号隔开.默认:全部组。eg.group1,group2 .
 *	 userIds - 推送用户id, 多个用户用英文逗号分隔，eg. user1,user2。
 * callback - Function
 *    ret - 返回结果
 *    err - 错误信息
 */
Push.prototype.message=function(body,callback){
	var options={
		url:this.baseurl+"/message",
		method:"POST",
		headers:{
			"X-APICloud-AppId":this.appId,
    		"X-APICloud-AppKey":this.appCode
		},
		json:body
	}

	request(options,function(err,res,body){
		callback(body,err);
	})
}