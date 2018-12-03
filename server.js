var express = require('express');
var app = express();
var http = require('http').createServer(app);
var fs = require('fs');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var session = require('express-session');
var multer  = require('multer');
var bodyparser = require('body-parser');
const path = require('path');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname );
    }
  });
  var upload = multer({ storage : storage}).fields([{name:'mainPhoto'},{name:'listPhoto'}]);


  var select = fs.readFileSync('select.html','utf-8');
  var region = fs.readFileSync('region.html','utf-8');

const mongoose = require('mongoose');

var manager_check = 0;    

mongoose.connect('mongodb://localhost:27017/myproject');
const Schema = mongoose.Schema;
const listSchema = new Schema({
    id:{type:String},
    restaurant: {type: String},
    kinds: {type: String},
    tel: {type: String},
    address: {type: String},
    score: {type:String},
    time: {type: String},
    holiday: {type: String},
    seat: {type: String},
    mainstream:{type:String},
    smoke:{type:String},
    reservation:{type:String},
    restroom:{type:String},
    delivery:{type:String},
    parking:{type:String},
    Etc:{type:String},
    infor:{type:String},
    mainImage:{type:String},
    listImage:[]
})
const loginSchema = new Schema({
    number: {type:Number},
    email: {type:String},
    id: {type: String},
    pwd: {type: String},
    admin: {type:Boolean},
    manager: {type:Boolean},
    write: {type:Boolean},
    delete: {type:Boolean}
});
var mongodb = mongoose.model('region',listSchema);
var logindb = mongoose.model('login',loginSchema);
var pageValue ='';
var select_number ='';



var member = fs.readFileSync('member.html','utf-8');
var member_list = fs.readFileSync('member_list.html','utf-8');



var a ='';
var b ='';
var c ='';
var region2 ='';
http.listen(3000,function(){
    console.log('server ok');
});
app.use(session({
    secret: '123lsaklskflaskflsa',
    resave: false,
    saveUninitialized: true
}))
app.use(bodyparser.json());
app.use('/index',express.static(__dirname+'/index'));
app.use('/a/',express.static(__dirname+'/'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/site.html');

})
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/category',function(req,res){
    res.sendFile(__dirname+'/category.html');
})
app.get('/write',function(req,res){
    res.sendFile(__dirname+'/write.html');
})
app.get('/home',function(req,res){
    res.sendFile(__dirname+'/home.html');
})
app.get('/list/menu',function(req,res){
    for(var i=0; i<region.length;i++){
        if(c==region[i][0]){
            region2 = region[i];
        }
    }
    res.send({region:region2})
})
app.get('/site/:region',function(req,res){
        res.send(ejs.render(region,{data:req.params.region}));
})

app.get('/region/infor/:id',function(req,res){
    var sess = req.session;
    var region3 = ''; 
    if(req.query.infor == 'seoul'){ region3 = '서울';}
    else if(req.query.infor == 'incheon'){region3 = '인천';}
    else if(req.query.infor == 'daejeon'){region3 = '대전';}
    else if(req.query.infor == 'daegu'){region3 = '대구';}
    else if(req.query.infor == 'busan'){region3 = '부산';}
    var page = (parseInt(req.params.id)-1)*15;
    mongodb.find({address:{$regex:region3}},function(err,docs){
        if ( docs.length % 15  == 0){
             sess.page = parseInt( docs.length / 15 ) ;
        }else{
            sess.page = parseInt( docs.length / 15 ) + 1;
        }
    })
    mongodb.find({address:{$regex:region3}}).skip(page).limit(15).exec(function(err,docs){

        res.send({result:docs,page:sess.page});
    })

    
})
app.get('/menu',function(req,res){
    var total_page = 0;
    var button_page = 0;
    var total_number = 0;
    var nowpage = (parseInt(req.query.now) - 1) * 7 ;
    mongodb.find({},function(err,docs){
        if(docs.length % 35 != 0){
             total_page = parseInt(docs.length / 35) + 1;
        }else{
             total_page = parseInt(docs.length / 35);
        }
        if(docs.length % 7 != 0){
             button_page = parseInt(docs.length / 7) + 1;
        }else{
             button_page = parseInt(docs.length / 7);
        } 
        total_number = docs.length
    })
    mongodb.find({}).skip(nowpage).limit(7).sort({id:-1}).exec(function(err,docs){
       res.send({
           data:docs,
           type:b,
           button:button_page,
           total:total_page,
           number : total_number
        });     
    });
});

app.get('/delete',function(req,res){
    for(var i=0; i<req.query.ckboxamount.length; i++){
        mongodb.findOneAndDelete({id:req.query.ckboxamount[i]},function(err,docs){
            console.log(docs);
        });  
    }
    mongodb.find({}).sort({id:-1}).exec(function(err,docs){
        res.send({data:docs}); 
    })

    
})
app.get('/main/inf',function(req,res){
    mongodb.find({},function(err,docs){
        res.send({result:docs});
    })
})
app.get('/menu/1',function(req,res){
    a = req.query.region_id;
    b = req.query.region_type;
    c = req.query.region;
    
    mongodb = mongoose.model(a,listSchema);
    fs.readFile('menu.html','utf8',function(err,data){
        res.send({data:data});
    });
});
app.get('/txtEditor',function(req,res){
    res.sendFile(__dirname+'/txt_editor.html');
});



app.post('/login',function(req,res){
    console.log(req.body);
    var sess = req.session;
    if(req.body.loginid != ''){
        logindb.findOne({id:req.body.loginid,pwd:req.body.loginpwd},function(err,docs){
            if(docs != null){
                sess.user = docs.id;
                sess.manager = docs.manager;
                sess.write = docs.write;
                sess.delete = docs.delete;
                if(docs.manager == true && docs.admin == false){
                    manager_check = 1;
                }
                sess.save(function(){
                    res.send({message:'환영합니다',id:sess.user,manager:sess.manager,write:sess.write,delete:sess.delete});
                })    
            }else{
                res.send({message:'아이디 또는 비밀번호를 잘못 입력하셨습니다'});
            }
        })
    }
    
})
app.get('/login/ing',function(req,res){
    var sess = req.session;
    if(req.session.user != ''){
        res.send({result:sess.user,admin:sess.manager,write:sess.write,delete:sess.delete});
    }
    
})

app.get('/logout',function(req,res){
    manager_check = 0;
    req.session.destroy(function(){ 
        req.session;
    });
    res.redirect('/');
})
app.get('/signup',function(req,res){
    res.sendFile(__dirname+'/signup.html');
})
app.get('/signup2',function(req,res){

    logindb.findOne({email:req.query.email},function(err,docs){    
        if(docs == null){
            logindb.findOne({id:req.query.id},function(err,docs){  
                if(docs == null){
                    logindb.find({},function(err,docs){
                        var leng = docs.length+1;
                        var login = new logindb({
                            number: leng,
                            email:req.query.email,
                            id:req.query.id,
                            pwd:req.query.pwd,
                            admin:false,
                            manager:false,
                            write:true,
                            delete:false
                        });
                        login.save(function(err,docs){
                            res.send({result:'환영합니다'});
                        });
                        
                    })  
                    
                }else{
                    res.send({result:'중복 ID가 있습니다.'});
                }
            })
        }else{
            res.send({result:'가입된 아이디가 있습니다.'});
        }
    });

})
app.get('/select',function(req,res){
    mongodb.findOne({id:req.query.id},function(err,docs){
        res.send(ejs.render(select,{data:docs}));
    })
})




app.post('/write/upload',function(req,res){
    var date = new Date();
    var year = date.getFullYear(),
    month = date.getMonth()+1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
    if(second < 10){
    second = '0'+date.getSeconds();
    }
    if(minute < 10){
    minute = '0'+date.getMinutes();
    }
    if(hour < 10){
    hour = '0'+date.getHours();
    }
    if(day < 10){
    day = '0'+date.getDate();
    }
    if(month < 10){
    month = '0'+date.getMonth();
    }
    var today = year+''+month+''+day+''+hour+''+minute+''+second;
    var mainImage = '';
    var listImage = new Array();
    var a = 3.5 + (Math.random()*1.5);
    a = a.toFixed(1);
        upload(req,res,function(err) {

            mainImage = req.files.mainPhoto[0].path;
            for(var i=0;i<req.files.listPhoto.length;i++){
                listImage.push(req.files.listPhoto[i].path);
            }
            var insert = new mongodb({
                id: today,
                restaurant: req.body.restaurant,
                kinds: req.body.kinds,
                tel: req.body.tel,
                address: req.body.address,
                score: String(a),
                time: req.body.time,
                holiday: req.body.holiday,
                seat: req.body.seat,
                mainstream: req.body.mainstream,
                smoke: req.body.smoke,
                reservation: req.body.reservation,
                restroom: req.body.restroom,
                delivery: req.body.delivery,
                parking: req.body.parking,
                Etc: req.body.Etc,
                infor: req.body.infor,
                mainImage: mainImage,
                listImage: listImage,
                
            });
            insert.save(function(err,docs){
                res.redirect('/');
            });
        });
    
});
app.get('/site/Etc/:id',function(req,res){
    res.sendFile(__dirname+'/etc.html');
})


 app.get('/list/:id',function(req,res){
     mongodb.find({},function(err,docs){
         pageValue = docs.length;
     })
     var skip = (parseInt(req.params.id)-1)*7;
     mongodb.find({}).sort({id:-1}).skip(skip).limit(7).exec(function(err,docs){
         res.send({data:docs,page:skip,pageValue:pageValue});
     })
 })

 app.get('/member/management',function(req,res){
    if(manager_check == 1){
        logindb.find({manager:false},function(err,docs){
            if( (docs.length % 10) != 0 ){
                var member_total = parseInt(docs.length / 10) + 1;
            }else{
                var member_total = parseInt(docs.length / 10) ;  
            }
            res.send(ejs.render(member,{total: member_total}));
        })
    }
    else{
        logindb.find({admin:false},function(err,docs){
            if( (docs.length % 10) != 0 ){
                var member_total = parseInt(docs.length / 10) + 1;
            }else{
                var member_total = parseInt(docs.length / 10) ;  
            }
            res.send(ejs.render(member,{total: member_total}));
        })
    }
    

 })
 app.get('/member/list/:id',function(req,res){
    var page2 = (parseInt(req.params.id) - 1) * 10;
    if(manager_check == 1){
        logindb.find({manager:false}).skip(page2).limit(10).exec(function(err,docs){
           
           res.send(ejs.render(member_list,{data:docs,check:1}));
        })
    }else{
        logindb.find({admin:false}).skip(page2).limit(10).exec(function(err,docs){
           res.send(ejs.render(member_list,{data:docs,check:0}));
        })
    }

})
 app.get('/member/save',function(req,res){
    if(manager_check == 1){
        for(var i=0; i < req.query.id.length; i++){
            var writes = true;
            var deletes = true;
            var id = String(req.query.id[i]);
            var num = i*2;
            id = id.split(' ');
            if(req.query.authority[num] == 'true'){
                writes = true;
            }else if(req.query.authority[num] == 'false'){
                writes = false;
            }
            if(req.query.authority[num+1] == 'true'){
                deletes = true;
            }else if(req.query.authority[num+1] == 'false'){
                deletes = false;
            }
           logindb.findOneAndUpdate({id:id},{ $set: {write:writes,delete:deletes}},function(err,docs){})
       }
       res.send();
    }else{

        for(var i=0; i < req.query.id.length; i++){
            var managers = true
            var writes = true;
            var deletes = true;
            var id = String(req.query.id[i]);
            var num = i*3;
            id = id.split(' ');
            if(req.query.authority[num] == 'true'){
                managers = true;
            }else if(req.query.authority[num] == 'false'){
                managers = false;
            }
            if(req.query.authority[num+1] == 'true'){
                writes = true;
            }else if(req.query.authority[num+1] == 'false'){
                writes = false;
            }
            if(req.query.authority[num+2] == 'true'){
                deletes = true;
            }else if(req.query.authority[num+2] == 'false'){
                deletes = false;
            }
           logindb.findOneAndUpdate({id:id},{ $set: {manager:managers,write:writes,delete:deletes}},function(err,docs){
               
           })
       }
       res.send();
    }
     
 })

