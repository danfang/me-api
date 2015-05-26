var foursquare = require('node-foursquare');
var handleError = require('../util/util').handleError;

var getFoursquare = function(req, settings) {
	var settings = { secrets: settings.foursquare.secrets }; 
	var redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl + "/redirect";
	settings.secrets.redirectUrl = redirectUrl;
	return foursquare(settings);
}

var Foursquare = {
	type: "location",
	source: "foursquare",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var accessToken = this.settings.foursquare.accessToken;
				if (!accessToken) {
					return res.status(404).json({ err: "You have not specified an access Token yet"});
				}
				var fs = getFoursquare(req, this.settings);
				fs.Users.getCheckins('self', {}, accessToken, function(err, checkins) {
					if (err) return handleError(err, res);
					res.json(checkins);
				});
			}
		},
		{
			method: "GET",
			path: "/login",
			handler: function(req, res) {
				if (this.settings.foursquare.accessToken) {
					return res.status(404).json({ err: "This user already has a valid access token"});
				}
				var fs = getFoursquare(req, this.settings);
				console.log(fs.getAuthClientRedirectUrl());
				res.writeHead(303, { 'location': fs.getAuthClientRedirectUrl() });
  				res.end();
			}
		},		
		{
			method: "GET",
			path: "/login/redirect",
			handler: function(req, res) {
				if (this.settings.foursquare.accessToken) {
					return res.status(404).json({ err: "This user already has a valid access token"});
				}
				var fs = getFoursquare(req, this.settings);
				fs.getAccessToken({ code: req.query.code }, function(err, accessToken) {
					if (err) return handleError(err, res);
					console.log(accessToken);
					res.json({ token: accessToken });
				});
			}
		},
	],
};

module.exports = Foursquare;