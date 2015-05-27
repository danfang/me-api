var ig = require('instagram-node').instagram();
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var Instagram = {
	type: "photos",
	source: "instagram",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var cachedResult = cache.get('instagram');
				if (cachedResult) {
					console.log('cache hit');
					return res.json(cachedResult);
				}

				var accessToken = this.settings.instagram.access_token;
				if (!accessToken) {
					return res.status(404).json({ err: "You have not specified an access Token yet"});
				}
				
				ig.use(this.settings.instagram);
				ig.user_self_feed(function(err, media, pag) {
					if (err) return handleError(err, res);
					var data = { photos: media };
					cache.put('instagram', data, 1000 * 30);
					console.log('cache miss');
					res.json(data);
				});
			}
		},
		{
			method: "GET",
			path: "/login",
			handler: function(req, res) {
				var accessToken = this.settings.instagram.access_token;
				if (accessToken) {
					return res.status(404).json({ err: "This user already has a valid access token"});
				}
				ig.use(this.settings.instagram);
				var redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl + "/redirect";
				res.redirect(ig.get_authorization_url(redirectUrl));
			}
		},		
		{
			method: "GET",
			path: "/login/redirect",
			handler: function(req, res) {
				if (this.settings.instagram.access_token) {
					return res.status(404).json({ err: "This user already has a valid access token"});
				}
				ig.use(this.settings.instagram);
				var redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0];
				ig.authorize_user(req.query.code, redirectUrl, function(err, result) {
				    if (err) return handleError(err, res);
			      	res.json(result.access_token);
			  	});
			}
		},
	],
};

module.exports = Instagram;