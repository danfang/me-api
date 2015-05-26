var Twit = require('twit');
var handleError = require('../util/util');

var Twitter = {
	type: "social",
	source: "twitter",
	routes: [
		{ 
			method: "GET",
			path: "",
			handler: function(req, res) {
				this.Twitter.get('/statuses/user_timeline', { screen_name: this.me }, function(err, data, response) {
					if (err) return handleError(err, res);
					res.json({ tweets: data });
				});
			}
		}
	],
	pre: function(data) {
		data.Twitter = new Twit(data.settings.twitter);
	},
}

module.exports = Twitter;