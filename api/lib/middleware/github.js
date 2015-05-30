var request = require('request');
var handleError = require('../util/util');
var cache = require('memory-cache');

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var Github = {
	source: "github",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var cachedResult = cache.get('github');
				if (cachedResult) return res.json(cachedResult);
				
				var url = 'https://api.github.com/users/' + this.me + "/events/public";
				request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					var data = JSON.parse(body);
					cache.put('github', data, DEFAULT_CACHE_MSEC);
					console.log('cache miss');
					return res.json(data);
				});
			}
		}
	],
}

module.exports = Github;