var request = require('request');
var cache = require('memory-cache');
var handleError = require('../util/util');

var DEFAULT_CACHE_MSEC = 1000 * 60 * 60; // 1 hour

// Get latest articles
var fetchPosts = function(user, callback) {
	var cachedResult = cache.get('medium');
	if (cachedResult) return callback(null, cachedResult);

	request('https://medium.com/' + user + "?format=json", function(err, response, body) {
		if (err || response.statusCode != 200) return callback(err, body);
		var data = parseJson(body);
		if (!data.success) return callback({ success: false }, body);
		var latest = data.payload.latestPosts;
		cache.put('medium', latest, DEFAULT_CACHE_MSEC);
		console.log('cache miss');
		return callback(null, latest);
	})
};

// Strip the security characters from the json response
var parseJson = function(str) {
	return JSON.parse(str.split("])}while(1);</x>")[1]);
};

var Medium = {
	source: "medium",
	routes: [
		{ 
			method: "GET",
			path: "", 
			handler: function(req, res) {
				fetchPosts(this.me, function(err, latestPosts) {
					if (err) return handleError(err, res);
					res.json(latestPosts);
				});
			} 
		},
		{ 
			method: "GET",
			path: "/:index", 
			handler: function(req, res) {
				var me = this.me;
				fetchPosts(me, function(err, latestPosts) {
					if (err) return handleError(err, res);

					var post = latestPosts[req.params.index];
					if (!post) return handleError('Invalid post index', res);

					var cachedResult = cache.get('medium-' + post.id);
					if (cachedResult) return res.json(cachedResult);

					// Get the specific article
					var url = 'https://medium.com/' + me + "/" + post.id + "?format=json";
					request(url, function(err, response, body) {
						if (err || response.statusCode != 200) return handleError(err, res);

						var data = parseJson(body);
						if (!data.success) return handleError(data, res);

						var payloadValue = data.payload.value;
						cache.put('medium-' + post.id, payloadValue, DEFAULT_CACHE_MSEC);
						console.log('cache miss');
						
						return res.json(payloadValue);
					});
				});
			} 
		}
	],
};

module.exports = Medium;