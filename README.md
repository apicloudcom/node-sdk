###概述
-------

APICloud的 NODE SDK 是基于request构建. 它与APICloud开发的api进行交互,支持对象化操作，简化文件上传、多个文件上传、Relation相关操作,只需要在你的代码中做出一点点改变.

###新手上路

------

首先需要引入模块,需要使用那部分就引用各自的模块。


模块未提交NPM,所以不能通过npm进行安装。    
需要把整个项目下载完成后复制到node_modules文件夹下，然后修改文件夹名称为APICloud    
如果运行不起要注意看node的控制台，因为Resource.js有一段代码
```js
var request = require('request'); //如果node环境没有依赖包，需要自己安装 npm install request
```

如果把相关代码添加到项目中，则直接引入即可。

```js
var Resource=require("APICloud").Resource;
var Push=require("APICloud").Push;
var Analytics=require("APICloud").Analytics;
```

如果想要按照模块的方式使用，只需要把项目拷贝到node_modules里边即可，如修改文件夹名为APICloud

```js
var Resource=require("APICloud").Resource;
var Push=require("APICloud").Push;
var Analytics=require("APICloud").Analytics;
```

然后需要配置进行调用的对象

```js
var resouce = new Resource("appId", "appKey");
var push= new Push("appId", "appKey");
var analytics = new Analytics("appId", "appKey");
```
最后就可以调用需要使用的方法，进行后续操作了。
```js
//具体参数参考推送文档
//{
//  "title":"",
//  "content":"",
//  "type":1,
//  "platform":0
//}
push.Message(jsonStr,function(ret,err){
  
});
```

```js
//具体参数参考统计文档
analytics.getAppStatisticDataById("2015-05-22", "2015-05-28",function(ret,err){
  
});
```

```js
//具体参数参考数据云文档
//modelName为class名称
var model=resouce.Factory(modelName);
model.Get(function(ret,err){
  
})
```

###API
------
####数据api


```js
Resource("appId", "appKey","url");
```

####参数

appId：

- 类型：字符串
- 默认值：无
- 描述：应用的id，在APICloud上应用概览里获取，不能为空

appKey：

- 类型：字符串
- 默认值：无
- 描述：应用的安全校验Key，在APICloud上应用概览里获取，不能为空

url：

- 类型：字符串
- 默认值：无
- 描述：应用服务器地址，可为空，为空时默认为编译时的服务器地址

####示例代码

```js
var client = new Resource("appId", "appKey");
```

###**设置参数**

```js
.setHeaders("key", "value");
```

####参数

key：

- 类型：字符串
- 默认值：无
- 描述：header的名字

value：

- 类型：字符串
- 默认值：无
- 描述：header的值


####示例代码

```js
var client = new Resource("appId", "appKey");
client.setHeaders("authorization",'token');//注销以及ACL的时候需要设置authorization
```

###**生成一个对象实例**

```js
.Factory("className");
```

####参数

className：

- 类型：字符串
- 默认值：无
- 描述：与您设置的classname保持一致



####示例代码

```js
var client = new Resource("appId", "appKey");
var Model = client.Factory("modelName");
```


##rest基本操作

###**增加**

向对象插入一条数据
.save({body}, callback(ret,err))

####body

value：

- 类型：JSON对象
- 默认值：无
- 描述：插入的键值对，与服务器上class中键值对应，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：插入成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.save({"username": username, "password": password,email:email}, function (ret,err) {
  console.log("Model insert:"+JSON.stringify(ret))
  console.log("Model insert:"+JSON.stringify(err))
});

```


###**删除**

根据ID删除对象的一条数据

.delete({params}, callback(ret, err))


####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被删除数据的行ID，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息，成功返回{}空对象

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.delete({
  "_id": "{{you id}}"
}, function (ret,err) {
  console.log("aa all delete:"+JSON.stringify(ret));
});

```


###**更新**

根据ID更新对象的一条数据

.save({params},{body},callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：将要更新数据的行ID，不能为空

####body

value：

- 类型：JSON
- 默认值：无
- 描述：将要更新的键值对，与服务器上class中键值对应，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：更新成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.save({"_id":id},{email:email,emailVerified:true},function(ret,err){
    console.log("Model update:"+JSON.stringify(ret));
});
```

###**根据id获取数据**

根据ID查找对象的一条数据

.get({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找数据的行ID，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：查找成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.get({"_id": id}, function (ret,err) {
    console.log("Model get:"+JSON.stringify(ret))
});
```



###**查询所有数据**

根据条件查找对象中所有符合条件的数据

.query({params}, callback(ret, err))

####params

filter：

- 类型：JSON对象
- 默认值：无
- 描述：查询条件的键值对

####callback(ret, err)

ret：

- 类型：JSON数组
- 描述：查找成功后对应的所有满足条件的数据

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.query(function (ret,err) {
    console.log("Model query:"+JSON.stringify(ret))
});

```

###**查询数据条数**

根据条件返回对象下满足该条件的总记录数

.count({params}, callback(ret, err))

####params

filter：

- 类型：JSON对象
- 默认值：无
- 描述：查询条件的键值对

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.count(function (ret,err) {
    console.log("Model count:"+JSON.stringify(ret))
});
```

###**判断对象是否存在**

查询某对象/对象下某行是否存在

.exists({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找数据的行ID，可为空，为空时返回对象是否存在

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.exists(function (ret,err) {
    console.log("Model exists:"+JSON.stringify(ret))
});
```


##rest文件操作

###**文件上传**

上传文件到云端file表里面

.save({body}, callback(ret, err))

####body

value

- 类型：JSON对象
- 默认值：无
- 描述：提交的文件及相关数据，不能为空
- 内部字段：

```js
{
  file:			//文件对象名称，file表为file，file字段则为具体名称
  {
    isFile:true，	//标示对象是一个文件对象
	  isFileClass:true，//标示当前是对file表进行操作，file表作为Relation表的时候必须
    path:'',		//文件地址
    values:{}//自定义字段或者filename
  }
};
```
####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息，服务器返回的数据

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
//对file表进行操作
var File = client.Factory("file");

api.getPicture({},function(ret,err){
    File.save({file:{isFile:true,path:ret.data,values:{filename:"头像.png"}}},function(data,err){
        alert("file:\t"+JSON.stringify(data));
        alert("file:\t"+JSON.stringify(err));
    })
})

//多文件上传,一个表有多个file字段
var bb = client.Factory("bb");
api.getPicture({},function(ret,err){
    var path1=ret.data;
    api.getPicture({},function(ret,err){
    var path2=ret.data;
    bb.save({file1:{isFile:true,path:path1},file2:{isFile:true,path:path2}},function(data,err){
            alert(JSON.stringify(data));
        })
  });
})

//file表作为Relation表，isFileClass必须设置，否则无法上传
var RelationFile = client.Factory("relationFile");
api.getPicture({},function(ret,err){
    RelationFile.save({"_id":"{{id}}","_relation":"{{relationName}}"},{file:{isFileClass:true,isFile:true,path:ret.data}},function(data,err){
        alert("file:\t"+JSON.stringify(data));
        alert("file:\t"+JSON.stringify(err));
    })
})
```


##Relation相关操作

####概述
主要用于对一张表中数据类型为Relation的列进行操作

###**增加**

向对象的某关系列下插入一条内容

.save({params},{body}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被插入对象ID，不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称，对应服务器上的同名relation，不能为空

####body

value：

- 类型：JSON对象
- 默认值：无
- 描述：插入的键值对，与服务器上class中键值对应，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.save({"_id":"xxxxxxxxxxxxxx","_relation":"many"},{"username": username, "password": password,email:email}, function (ret,err) {
  console.log("Model insert:"+JSON.stringify(ret))
  console.log("Model insert:"+JSON.stringify(err))
});
```


###**数据条数**

查找对象某关系列下对应的数据总条数

.count({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找对象ID，不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称，对应服务器上的同名relation，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息


####示例代码

```js
var Model = client.Factory("modelName");

Model.count({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```

###**获取**

获取对象某关系列下对应的所有数据

.get({params}, callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：被查找对象ID，不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称，对应服务器上的同名relation，不能为空

####callback(ret, err)

ret：

- 类型：JSON数组
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.get({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```


###**删除**

删除对象某关系列下对应的所有数据

.delete({params}, callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：被删除对象ID，不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称，对应服务器上的同名relation，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.delete({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```

##用户相关

####概述
user对象提供用户独有操作，如登录、注销、发送重置密码邮件、发送验证邮件。

###**login**

登录

.login({params}, callback(ret, err))

####params

username：

- 类型：字符串
- 默认值：无
- 描述：用户名，不能为空

password：

- 类型：字符串
- 默认值：无
- 描述：密码，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.login({username: username, password: password}, function (ret,err) {
  console.log("user.login:"+JSON.stringify(ret))
  console.log("user.login:"+JSON.stringify(err))
});
```


###**logout**

注销登录

.logout(callback(ret, err))

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
//注销以及ACL的时候需要设置authorization
client.setHeaders("authorization",$api.getStorage('token'));
var User = client.Factory("user");

User.logout({token: token}, function (ret,err) {
    console.log("user.logout:"+JSON.stringify(ret))
});

```


###**verify**

发送验证邮件

.verify({params}, callback(ret, err))

####params

email：

- 类型：字符串
- 默认值：无
- 描述：需要验证的邮箱

username：

- 类型：字符串
- 默认值：无
- 描述：需要验证的用户名

language：

- 类型：字符串
- 默认值：无
- 描述：邮件需要使用的语言，为了应多多语言，中文（zh_CN），英文（en_US）

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.verify({"email":email, "language":"zh_CN", "username":username},function(ret,err){
    console.log("verify ret:\t"+JSON.stringify(ret))
})
```

###**reset**

发送重置密码邮件

.reset({params}, callback(ret, err))

####params

email：

- 类型：字符串
- 默认值：无
- 描述：需要验证的邮箱

username：

- 类型：字符串
- 默认值：无
- 描述：需要验证的用户名

language：

- 类型：字符串
- 默认值：无
- 描述：邮件需要使用的语言，为了应多多语言，中文（zh_CN），英文（en_US）

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.reset({"email":email, "language":"zh_CN", "username":username},function(ret,err){
    console.log("reset ret:\t"+JSON.stringify(ret))
})
```
##查询参数

####示例代码

```js

var Model = client.Factory("modelName");

Model.query({filter：{
	where：{}，
	skip：0，
	limit：10，
	order："id DESC",
	include:"relation"
}}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});


```

fields、limit、order、skip、where、include、includefilter相关参数请参考[云api文档](http://docs.apicloud.com/%E4%BA%91API/data-cloud-api#6)

##批量查询

.batch(requests,callback(ret,err))

**提示**
batch为全局函数,即只能在Resouce对象上调用

**示例**

```js
var client = new Resource("appId", "appKey");
client.batch()
```

####requests
- 类型：JSON对象数组
- 描述：每个对象是一个请求信息

**示例** 


method为POST、PUT的时候需要在body内传值,为GET的时候不需要传递body
path路径为相对路径

**GET**
```js
{
    "method": "GET",
    "path": "/mcm/api/company",
}
```

**POST**
```js
{
    "method": "POST",
    "path": "/mcm/api/company",
    "body": {
      "name": "apicloud",
      "address": "北京市..."
    }
}
```

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var requests=[
    {
        "method": "GET",
        "path": "/mcm/api/company",
    },
    {
        "method": "POST",
        "path": "/mcm/api/company",
        "body": {
          "name": "apicloud",
          "address": "北京市..."
        }
    }
]
client.batch(requests, function (ret,err) {
  console.log("batch:"+JSON.stringify(ret))
  console.log("batch:"+JSON.stringify(err))
});

```

返回ret结果为一个顺序数组

```js
[
 {
    //request 1的结果 
 },
 [
    //request 2的结果
 ],
 ...
 {
     //request N的结果
 }   
]
```

####推送api


#####**Message**
------
Message为Push下的函数，主要是是用来推送信息。

**参数**
- jsonStr-推送消息的json对象，具体参数参考[文档](http://docs.apicloud.com/%E4%BA%91API/push-cloud-api)

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```js
//{
//  "title":"APICloud",
//  "content":"",
//  "type":1,
//  "platform":0
//}
push.Message(jsonStr,function(ret,err){
  
});
```

####统计api


#####**getAppStatisticDataById**
------
getAppStatisticDataById为Analytics下的函数，该接口主要用于获取用户指定应用ID及时间范围内的相关应用统计数据信息

**参数**
- startDate(必填)-字符串类型,开始日期
- endDate(必填)-字符串类型,结束日期

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```js
Analytics.getAppStatisticDataById("2015-05-22", "2015-05-28",function(ret,err){
  
});
```

#####**getVersionsStatisticDataById**
------
getVersionsStatisticDataById为Analytics下的函数，该接口主要用于获取用户指定应用ID及时间范围内相关应用各版本的统计数据信息

**参数**
- startDate(必填)-字符串类型,开始日期
- endDate(必填)-字符串类型,结束日期

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```js
Analytics.getVersionsStatisticDataById("2015-05-22", "2015-05-28",function(ret,err){
  
});
```

#####**getGeoStatisticDataById**
------
getGeoStatisticDataById为Analytics下的函数，该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本地理分布统计数据信息

**参数**
- startDate(必填)-字符串类型,开始日期
- endDate(必填)-字符串类型,结束日期
- versionCode(必填)-字符串类型,版本号

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```js
Analytics.getGeoStatisticDataById("2015-05-22", "2015-05-28","",function(ret,err){
  
});
```

#####**getDeviceStatisticDataById**
------
getDeviceStatisticDataById为Analytics下的函数，该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本设备信息分布统计数据信息

**参数**
- startDate(必填)-字符串类型,开始日期
- endDate(必填)-字符串类型,结束日期

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```C#
Analytics.getDeviceStatisticDataById("2015-05-22", "2015-05-28",function(ret,err){
  
});
```

#####**getExceptionsStatisticDataById**
------
getExceptionsStatisticDataById为Analytics下的函数，该接口主要用于获取用户指定应用ID及时间范围内的应用下各版本异常错误统计数据信息

**参数**
- startDate(必填)-字符串类型,开始日期
- endDate(必填)-字符串类型,结束日期

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```C#
Analytics.getExceptionsStatisticDataById("2015-05-22", "2015-05-28",function(ret,err){
  
});
```

#####**getExceptionsDetailByTitle**
------
getExceptionsDetailByTitle为Analytics下的函数，该接口主要用于根据应用异常错误摘要获取异常错误详细信息

**参数**
- title(必填)-字符串类型,异常错误摘要

**返回值**
- ret 返回信息
- err 错误信息


**示例**

```C#
Analytics.getExceptionsDetailByTitle("2015-05-22", "2015-05-28",function(ret,err){
  
});
```
