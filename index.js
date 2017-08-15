const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');
const router = require('./router');

const app = express();  
const request = require('./request');

const port = 3000;

app.set('view engine', 'pug'); //set view engine

app.use(bodyParser.urlencoded({extended: true})); // parse post body
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', router); // routing

// Handling 404 errors
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });


//Start the server
var server = app.listen(port, () => {
    console.log('Server is running on port ' + server.address().port);
});

