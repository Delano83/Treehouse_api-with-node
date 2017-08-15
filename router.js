"use strict";
//require all dependencies
var express = require('express');
var router = express.Router();
var request = require('./request.js');

//make a get call to the root
router.get('/', function(req, res, next) {
   // make api calls
  let timeline = request.twitGet('statuses/home_timeline', { count: 5});
  let friends = request.twitGet('friends/list', { count: 5 });
  let messages = request.twitGet('direct_messages', { count: 5 });
  let sentMessages = request.twitGet('direct_messages/sent', { count: 5 });
  let account = request.twitGet('account/verify_credentials');

  // resolve all asynchronous api calls in a promise
  Promise.all([
     account,
     timeline,
     friends,
     messages,
     sentMessages
    ]) 
    .then((data) => { //once all API calls are resolved, use the data
        //variable used to structure the response and extract only the data we'll need in the template    
         var local = {
            yourAccount: [{
            name: data[0].name,
            screenName: data[0].screen_name,
            avatar: data[0].profile_image_url,
            bg: data[0].profile_background_image_url
            }],

            timeline: data[1].map(el=>({
            name: el.user.name,
            screenName: el.user.screen_name,
            avatar: el.user.profile_image_url,
            text: el.text,
            retweeted: el.retweet_count,
            favorited: el.favorite_count,
            posted: request.timeSincePost(el.created_at, new Date().toUTCString())
            })),
            
            friends:data[2].users.map(el=>({
            name:el.name,
            screenName:el.screen_name,
            avatar:el.profile_image_url
            })),
          
            messages: data[3].map(el=> ({
            sender: el.sender.screen_name,
            recipient: el.recipient.screen_name,
            text: el.text,
            timestamp: Date.parse(el.created_at),
            posted: el.created_at,
            avatar: el.sender.profile_image_url
            }))
              
         };

        //render the home template 
            res.render('home', {local});

       }).catch((reason) => { //catch and log any errors

      var error = new Error();

      error.status = reason.statusCode || 500;
      error.message = reason.message;
      
      console.log(error.message);

      next(error);
    });

    });
    
    //post route to twitter
    router.post('/', function(req, res, next){

  // make api call
  var tweet = request.twitPost('statuses/update', {status: req.body.tweet});

  
  tweet.then(function(data){
    res.redirect('/');

  }).catch(function(reason){ //catch errors on the post route

    var error = new Error();

    error.status = reason.statusCode || 500;
    error.message = reason.message;

    return next(error);
  });
});
//export the module
module.exports = router;