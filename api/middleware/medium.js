var request = require('request');
var handleError = require('../util/util');

var fetchPosts = function(user, callback) {
	request('https://medium.com/' + user + "?format=json", function(err, response, body) {
		if (err || response.statusCode != 200) return callback(err, body);
		var data = parseJson(body);
		if (!data.success) return callback({ success: false }, body);
		var latest = data.payload.latestPosts;
		return callback(null, latest);
	})
};

var parseJson = function(str) {
	return JSON.parse(str.split("])}while(1);</x>")[1]);
};

var Medium = {
	type: "blog",
	source: "medium",
	routes: [
		{ 
			method: "GET",
			path: "", 
			handler: function(req, res) {
				fetchPosts(this.me, function(err, latestPosts) {
					if (err) return handleError(err, res);
					res.json({ posts: latestPosts });
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
					if (!post) return res.status(404).json({ err: 'Invalid post index' });

					var url = 'https://medium.com/' + me + "/" + post.id + "?format=json";
					request(url, function(err, response, body) {
						if (err || response.statusCode != 200) return handleError(err, res);
						var data = parseJson(body);
						if (data.success) {
							return res.json({ post: data.payload.value });
						}
						return res.status(404).json({ success: false });
					});
				});
			} 
		}
	],
};

module.exports = Medium;