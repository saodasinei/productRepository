const http = require('http');
const request =require('request');

const hostIP='localhost'
const apiPort=8082;


// 创建API代理服务
const apiServer = http.createServer((req,res)=>{
	console.log('[apiServer]req.url='+req.url);
    const url='https://4665c4f48cc5933f625d29f7dcca5038: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@auroras-tienda.myshopify.com/admin/api/2020-04/products.json';
    console.log('[apiServer]url='+url);
    const options={
    	url:url
    };

    function callback(error, response, body){
    	if(!error && response.statusCode === 200){
    		res.setHeader('Content-Type','text/plan;charset=UTF-8');
    		res.setHeader('Access-Control-Allow-Origin','*');
    		res.end(body);
    	}
    }
    request.get(options,callback)
});



apiServer.listen(apiPort,hostIP,()=>{
     console.log('代理接口，运行于 http://'+hostIP+':'+apiPort+'/');
});

