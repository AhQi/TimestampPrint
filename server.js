 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/:query')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
      var timeStr = req.params.query;
      var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var ret = { "unix": null, "natural": null };
  
      if(isNaN(timeStr)){
        //res.send("query is not a num");
        var strToDate = new Date(timeStr);
        var unixStamp = strToDate.getTime();


        if(isNaN(unixStamp)){
          //res.send('input string is not natural language time format');
        }else{
          //res.send('valid format');    
          ret["unix"] = unixStamp/1000;
          ret["natural"] = timeStr;

        }
      }else{
        //res.send("is a num");
        ret["unix"] = parseInt(timeStr);
        timeStr = parseInt(timeStr)*1000;
        
        var unixToDate = new Date(timeStr);
        var naturalTime  = '';
        naturalTime += month[unixToDate.getMonth()];
        naturalTime += ' '+unixToDate.getDate()+', '+unixToDate.getFullYear();
          
        ret["natural"] = naturalTime;
      }
  
      

      res.send(ret);
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

