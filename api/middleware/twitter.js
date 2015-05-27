var Twit = require('twit');
var cache = require('memory-cache');
var handleError = require('../util/util');

var Twitter = {
	type: "social",
	source: "twitter",
	routes: [
		{ 
			method: "GET",
			path: "",
			handler: function(req, res) {
				var cachedResult = cache.get('twitter');
				if (cachedResult) {
					console.log('cache hit');
					return res.json(cachedResult);
				}
				this.Twitter.get('/statuses/user_timeline', { screen_name: this.me }, function(err, data, response) {
					if (err) return handleError(err, res);
					var data = { tweets: data };
					cache.put('twitter', data, 1000 * 30);
					console.log('cache miss');
					res.json(data);
				});
			}
		}
	],
	pre: function(data) {
		data.Twitter = new Twit(data.settings.twitter);
	},
}

module.exports = Twitter;