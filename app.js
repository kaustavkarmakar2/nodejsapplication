// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var  bodyParser = require('body-parser');
var http = require("http");



var indexRouter = require('./routes/index');
var interRouter= require('./routes/inter');
var commonRouter= require('./routes/common');
var custRouter= require('./routes/cust');
var indexRouterApi = require('./routesapi/index');

var cors= require('cors');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));


var server=http.Server(app);
var io = require("socket.io")(server);
var users= [];
server.listen(3001,function(){
  console.log("the developement server is running at 3001");
});
app.get("/index",function(req,res){
  res.sendFile(__dirname + "/index.html");
})
app.get("/styles/index.css",function(req,res){
  res.sendFile(__dirname + "/styles/index.css");
})
io.on("connection",function(socket){
  var name = "";
  socket.on("has connected",function(username){
   name = username;
   users.push(username);
   io.emit("has connected",{username: username ,usersList: users});
  });
  socket.on("disconnect",function(){
    users.slice(users.indexOf(name),1);
    io.emit("has disconnected",{username: name, usersList: users});
  });
  socket.on("new message",function(data){
    console.log("hhhhhhh",data)
    io.emit("new message", data);
  });
});

var whitelist = ['http://localhost','http://192.168.10.174','http://newb2c.billionskills.com','http://www.newb2c.billionskills.com'];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.enable('trust proxy');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(cors(corsOptionsDelegate));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inter',interRouter);
app.use('/common',commonRouter);
app.use('/cust',custRouter);
app.use('/sequelize',indexRouterApi);
//app.use('/token', tokenRouter);

 app.use(function(req, res, next) {
   res.status(400).send("You seem to be confused about your doings!");
 });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.content = err.message;
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
