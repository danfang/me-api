var fs = require('fs');
var express = require('express');
var request = require('request');
var Twit = require('twit');
var router = express.Router();

var me = JSON.parse(fs.readFileSync('me.json', 'utf8'));
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

router.get('/', function(req, res, next) {
	res.json(me);
});

// TODO: Fetch into DB
if (me.blog.medium) {
	router.get('/blog', function(req, res) {
		getLatestMediumPosts(function(err, latestPosts) {
			if (err) return handleError(err, res);
			res.json({ posts: latestPosts });
		})
	});

	router.get('/blog/:index', function(req, res) {
		getLatestMediumPosts(function(err, latestPosts) {
			if (err) return handleError(err, res);

			var post = latestPosts[req.params.index];
			if (!post) return res.status(404).json({ err: 'Invalid post index' });

			var url = 'https://medium.com/' + me.blog.medium + "/" + post.id + "?format=json";
			request(url, function(err, response, body) {
				if (err || response.statusCode != 200) return handleError(err, res);
				var data = parseMediumJson(body);
				if (data.success) {
					return res.json({ post: data.payload.value });
				}
				return res.status(404).json({ success: false });
			});
		})
	});

	var getLatestMediumPosts = function(callback) {
		request('https://medium.com/' + me.blog.medium + "?format=json", function(err, response, body) {
			if (err || response.statusCode != 200) return callback(err, body);
			var data = parseMediumJson(body);
			if (!data.success) return callback({ success: false }, body);
			var latest = data.payload.latestPosts;
			return callback(null, latest);
		});
	};

	var parseMediumJson = function(str) {
		return JSON.parse(str.split("])}while(1);</x>")[1]);
	};
}

// TODO: Use Twitter Streams
if (me.social.twitter && settings.twitter) {
	var Twitter = new Twit(settings.twitter);
	router.get('/twitter', function(req, res) {
		Twitter.get('/statuses/user_timeline', { screen_name: me.social.twitter }, function(err, data, response) {
			if (err) return handleError(err, res);
			res.json({ tweets: data });
		});
	});
}

// TODO: Look into Webhooks
if (me.code.github) {
	router.get('/code', function(req, res) {
		var url = 'https://api.github.com/users/' + me.code.github + "/events/public";
		request({ 
			url: url,
			headers: {
				'User-Agent': me.code.github
			}
		}, function(err, response, body) {
			if (err || response.statusCode != 200) return handleError(err, res);
			return res.json(JSON.parse(body));
		});
	});
}

var handleError = function(err, res) {
	res.status(500).json({ err: err });
	return false;
};

module.exports = router;
