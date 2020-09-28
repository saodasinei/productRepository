const express = require('express');
const express_static = require('express-static');
const consolidate = require('consolidate');
const mysql=require('mysql')
const bodyParser = require('body-parser');

const db=mysql.createPool({host:'10.10.10.6',user:'root',password:'root',database:'pronew'});


const app = express ();
app.listen(8081);



// template
app.set('view engine','html');
app.set('views','./views');
app.engine('html', consolidate.ejs);


// router
app.use(express.static('./public'));
app.get('/',function(req,res) {

	     res.render('info.html');
	  
});

app.get('/load',function(req,res) {
	    console.log(req.query);
        db.query('SELECT * FROM product_list',(err,data)=>{
	  	 if(err){
	  	 	console.log(err);
	  	 	res.status(500).send('Something wrong in database!').end();
	  	   }
	  	   else{
	  	     product=data;
	  	   	 res.send({product});
	  	   }
	  });
});

app.get('/search1',function(req,res){
	 console.log(req.query.search1_value);
	 console.log(req.query.search2_value);
	 db.query('SELECT * FROM product_list',(err,data)=>{
	 	if(err){
	 		console.log(err);
	 		res.status(500).send('Something wrong in database!').end();
	 	}
	 	 else{
            if(req.query.search1_value){
            	product=data.filter(function(data){
                     return (data.catalog_level1.toLowerCase().indexOf(req.query.search1_value.toLowerCase()) !== -1);
            	});
             }else{
            	product=data;
            }
            res.send({product});
	 	 }
	 });
	 console.log('search1');
});

app.get('/search2',function(req,res){
	 console.log(req.query.search2_value);
     db.query('SELECT * FROM product_list',(err,data)=>{
     	if(err){
     		res.status(500).send('Something worng in database!').end();
     	}else{
     		if(req.query.search2_value){
               product=data.filter(function(data){
                     return (data.catalog_level2.toLowerCase().indexOf(req.query.search2_value.toLowerCase()) !== -1);
                 });

     		}else{
     			product=data;
     		}

     		res.send({product});
     	}
     });
	 console.log('search2');
});





//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//代理
app.post('/api',function(req,res){
	console.log(req.body);
	var superagent = require('superagent');
	let resdata = req.body;
	var jsonArray = eval(resdata);
	var title  = jsonArray[''+"product[title]"+''] ;
	var price  = jsonArray[''+"product[variants][0][price]"+''];
	var desc = jsonArray[''+"product[body_html]"+''];
	var productType = jsonArray[''+"product[product_type]"+''];
	var image = jsonArray[''+"product[images][0][src]"+''] ;
	console.log(title);
	console.log(price);
	console.log(desc);
	console.log(productType);
	console.log(image);
    let data = {
		"product":
			{
				"title" : title,
				"body_html":desc,
				"variants":[
					{
						"option1" : "First",
						"price" : price,
						"sku" : "100"
					}
				],
				"product_type" :productType,
				"images": [
					{
						"src": image
					}
				]
			}
    }
	var sreq = superagent
	    .post("https://4665c4f48cc5933f625d29f7dcca5038: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@auroras-tienda.myshopify.com/admin/api/2020-04/products.json")
		.send(data)
		.set('Accept', 'application/json')
	console.log(sreq);

	sreq.pipe(res);
	sreq.on('end',function(){
		console.log('done');
	});
});











