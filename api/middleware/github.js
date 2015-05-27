var request = require('request');
var handleError = require('../util/util');
var cache = require('memory-cache');

var Github = {
	type: "code",
	source: "github",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var cachedResult = cache.get('github');
				if (cachedResult) {
					console.log('cache hit');
					return res.json(cachedResult);
				}
				var url = 'https://api.github.com/users/' + this.me + "/events/public";
				request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					var data = JSON.parse(body);
					cache.put('github', data, 1000 * 60 * 2);
					console.log('cache miss');
					return res.json(data);
				});
			}
		}
	],
}

module.exports = Github;