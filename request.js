const Twit = require('twit');
const T = new Twit(require('./js/config.js'));

module.exports = {
  //handle the API call inside a promise
  //get  module
  twitGet: function(endpoint, options) {
		return new Promise((resolve, reject) => {
			T.get(endpoint, options, function(error, data, response) {
					if (error) {
            console.log(error);
						return reject(error);
					}
				    resolve(data);
				});
		});
	},
  //post module
  twitPost: function(endpoint, options){
    return new Promise((resolve, reject) => {
			T.post(endpoint, options, function(error, data, response) {
					if (error) {
            console.log(error);
						return reject(error)
					}
					resolve(data);
				});
		});
  },

  // output readable, twittre-like post timestamps
  timeSincePost: function(datePosted, dateViewed){

    function toTimeStamp(dateString){
      return Date.parse(dateString) / 1000;
    }

    datePosted = toTimeStamp(datePosted);
    dateViewed = toTimeStamp(dateViewed);

    var timeElapsed = dateViewed - datePosted;

    var minute = 60;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var year = week * 52;

    var output;

    if(timeElapsed < minute){
      output = Math.round(timeElapsed) + ' s';

    }else if(timeElapsed < hour){
      output = Math.round(timeElapsed / minute) + ' m';

    }else if(timeElapsed < day){
      output = Math.round(timeElapsed / hour) + ' h';

    }else if(timeElapsed < week){
      output = Math.round(timeElapsed / day) + ' d';

    }else if(timeElapsed < year){
      output = Math.round(timeElapsed / week) + ' w';

    }else{
      output = Math.round(timeElapsed / year) + ' y';
    }

    return output;
  },

  
};

