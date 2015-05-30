var ig = require('instagram-node').instagram();
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var Instagram = {
	source: "instagram",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var cachedResult = cache.get('instagram');
				if (cachedResult) return res.json(cachedResult);

				var accessToken = this.secrets.access_token;
				if (!accessToken) return handleError("You have not specified an access Token yet", res);

				ig.use(this.secrets);
				ig.user_self_feed(function(err, media, pag) {
					if (err) return handleError(err, res);
					var data = { photos: media };
					cache.put('instagram', data, DEFAULT_CACHE_MSEC);
					console.log('cache miss');
					res.json(data);
				});
			}
		},
		{
			method: "GET",
			path: "/login",
			handler: function(req, res) {
				var accessToken = this.secrets.access_token;
				if (accessToken) return handleError("This user already has a valid access token", res);

				ig.use(this.secrets);
				var redirectUrl = req.protocol + '://' + this.host + req.originalUrl + "/redirect";
				res.redirect(ig.get_authorization_url(redirectUrl));
			}
		},		
		{
			method: "GET",
			path: "/login/redirect",
			handler: function(req, res) {
				var accessToken = this.secrets.access_token;
				if (accessToken) return handleError("This user already has a valid access token", res);

				ig.use(this.secrets);
				var redirectUrl = req.protocol + '://' + this.host + req.originalUrl.split("?")[0];
				ig.authorize_user(req.query.code, redirectUrl, function(err, result) {
				    if (err) return handleError(err, res);
			      	res.json(result.access_token);
			  	});
			}
		},
	],
};

module.exports = Instagram;