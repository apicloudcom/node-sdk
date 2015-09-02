var request = require('request');
var fs = require('fs');
var crypto = require('crypto');

function SHA1(str){
    var sha1 = crypto.createHash('sha1');
        sha1.update(str);
    return sha1.digest('hex');
}

function copy(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    var temp = obj.constructor();
    // changed

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = copy(obj[key]);
        }
    }
    return temp;
}

function isType(type) {
    return function (obj) {
        return {}.toString.call(obj) == "[object " + type + "]"
    }
}

var isFunction = isType("Function");

function Resource(appId, appKey, baseurl) {
    var now = Date.now();
    this.appId = appId;
    this.baseurl = baseurl || "https://d.apicloud.com/mcm/api";
    this.appCode = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now;
    this.defaultactions = {
        'get': {method: 'GET',params: ["_id", "_relation"]}, //_relationid 后续支持
        'save': {method: 'POST',params: ["_id", "_relation"]}, //_relationid 后续支持
        'query': {method: 'GET',params: ["filter"]},
        'delete': {method: 'DELETE',params: ["_id", "_relation"]}, //_relationid 后续支持
        'login': {method: "POST",params: ["username", "password"]},
        'logout': {method: "POST"},
        'count': {method: "GET",params: ["_id", "_relation","filter"]},
        'exists': {method: "GET",params: ["_id"]},
        'findOne': {method: 'GET',params: ["filter"]},
        'verify': {method: "POST",params: ["email", "language", "username"],alias: "verifyEmail"},
        'reset': {method: "POST",params: ["email", "language", "username"],alias: "resetRequest"}
    };
    this.headers={};
    this.setHeaders("X-APICloud-AppId",this.appId);
    this.setHeaders("X-APICloud-AppKey",this.appCode);
}
Resource.prototype.setHeaders=function(key,value){
    this.headers[key]=value;
}

Resource.prototype.batch=function(requests,callback){
    var ajaxConfig={
        url: this.baseurl+"/batch",
        method: "POST",
        json: {
            requests:requests
        }
    }
    ajaxConfig["headers"] = {};
    for(var header in this.headers){
        ajaxConfig["headers"][header]=this.headers[header];
    }
    request(ajaxConfig, function (err,res,ret) {
        callback(ret, err)
    });
}

Resource.prototype.upload = function (modelName,isFilter, item, params, callback) {
    if (typeof params == "function") {
        callback = params;
        params = {};
    }
    var filepath=item.path;
    var values = item.values||{};
    var url=params["_id"]&&params["_relation"]?("/"+modelName+"/"+params["_id"]+"/"+params["_relation"]):"/file";
    var isPut=(!params["_relation"])&&params["_id"];
    var fileUrl = this.baseurl + url + ( isPut ? ("/" + params["_id"]) : "");
    var filename = filepath.substr(filepath.lastIndexOf("/") + 1, filepath.length);
    if(!values["filename"]) values["filename"]=filename;
    values["file"]=fs.createReadStream(filepath);
    var ajaxConfig={
        url: fileUrl,
        method: isPut ? "PUT" : "POST",
        json:true,
        formData :values
    }
    ajaxConfig["headers"] = {};
    for(var header in this.headers){
		if(header=="Content-Type") continue;
        ajaxConfig["headers"][header]=this.headers[header];
    }
    request(ajaxConfig, function (err,res,ret) {
        if (ret && ret.id && !err) {
            var newobj = {};
            if (isFilter) {
                newobj["id"] = ret["id"];
                newobj["name"] = ret["name"];
                newobj["url"] = ret["url"];
                callback(null, newobj)
            } else {
                callback(null, ret);
            }
        } else {
            callback(ret || err, null)
        }
    });
}

Resource.prototype.Factory = function (modelName) {
    var self = this;
    var route = new Route(modelName, self.baseurl);
    var actions = copy(this.defaultactions);
    var resourceFactory = new Object();
    Object.keys(actions).forEach(function (name) {
        if (modelName != "user" && ["login", "logout", "verify", "reset"].indexOf(name) != -1){ return;}
        resourceFactory[name] = function (a1, a2, a3) {
            var action = copy(actions[name]);
            var params = {}, data, callback;
            var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
            switch (arguments.length) {
                case 3:
                    params = a1;
                    data = a2;
                    callback = a3;
                    break;
                case 2:
                    if (hasBody)
                        data = a1;
                    else
                        params = a1;
                    callback = a2;
                    break;
                case 1:
                    if (isFunction(a1))
                        callback = a1;
                    else if (hasBody)
                        data = a1;
                    else
                        params = a1;
                    break;
                case 0:
                    break;
                default:
                    throw new Error("参数最多为3个");
            }
            if (hasBody&&name != "logout") {
                var fileCount = 0;
                Object.keys(data).forEach(function (key) {
                    var item = data[key];
                    if (item && item.isFile) {
                        var isFilter = true;
                        if (modelName == "file"||item.isFileClass) {
                            isFilter = false;
                        }
                        fileCount++;
                        self.upload(modelName,isFilter, item, modelName == "file"?params:{}, function (err, returnData) {
                            if (err) {
                                return callback(null, err);
                            } else {
                                console.log(isFilter)
                                if (!isFilter)
                                    return callback(returnData, null);
                                data[key] = returnData;
                                fileCount--;
                                if (fileCount == 0) {
                                    next();
                                }
                            }
                        })
                    }
                });
                if (fileCount == 0) {
                    next();
                }
            } else {
                next();
            }
            function next() {
                var httpConfig = {};
                httpConfig["headers"] = {};
                for(var header in self.headers){
                    httpConfig["headers"][header]=self.headers[header];
                }
                if (name === "logout"&&!httpConfig["headers"]["authorization"]) {
                     return callback({status:0,msg:"未设置authorization参数,无法注销!"}, null);
                }
                if (hasBody) {
                    httpConfig.json =data;
                }else{
                    httpConfig.json=true;
                }
                
                if (params && (name == "save") && params["_id"] && (!params["_relation"]) && (!params["_relationid"])) {
                    action.method = "PUT";
                }
                if (params && (name == "save") && params["_id"] && params["_relation"] && params["_relationid"]) {
                    action.method = "PUT";
                }
                for (var key in action) {
                    if (key != 'params' && key != "alias") {
                        httpConfig[key] = copy(action[key]);
                    }
                }

                var curparams = {};
                action.params = action.params || [];
                for (var k = 0, len = action.params.length; k < len; k++) {
                    var tempkey = action.params[k];
                    if (params[tempkey]) {
                        curparams[tempkey] = copy(params[tempkey]);
                    }
                }
                if (["login", "logout", "count", "exists", "verify", "reset", "findOne"].indexOf(name) != -1) {
                    curparams["_custom"] = action.alias || name;
                }
                route.setUrlParams(httpConfig, curparams);
                console.log(httpConfig.method + "\t" + httpConfig.url);
                request(httpConfig, function (err,res,ret) {
                    return callback(ret, err);
                })
            }
        };
    });
    return resourceFactory;
};

function Route(template, baseurl) {
    this.template = template;
    this.baseurl = baseurl;
}

Route.prototype = {
    setUrlParams: function (config, params) {
        var url = "/:_class/:_id/:_relation/:_custom/:_relationid";
        url = url.replace(":_class", this.template);
        var parArr = [];
        Object.keys(params).forEach(function (ckey) {
            if (ckey.charAt(0) == '_') {
                url = url.replace(":" + ckey, params[ckey]);
                delete params[ckey];
            } else {
                if (ckey == "filter") {
                    parArr.push(ckey + "=" + encodeURIComponent(JSON.stringify(params[ckey])));
                }
            }
        });
        url = url.replace(/:[^/]+/ig, '/');
        if (parArr.length > 0) {
            url += ("?" + parArr.join("&"));
        }
        url = url.replace(/\/+/g, '/');
        config.url = this.baseurl + url;
    }
};

module.exports=Resource;