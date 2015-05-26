var request = require('request');
var handleError = require('../util/util');

var Github = {
	type: "code",
	source: "github",
	routes: [
		{
			method: "GET",
			path: "",
			handler: function(req, res) {
				var url = 'https://api.github.com/users/' + this.me + "/events/public";
				request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					return res.json(JSON.parse(body));
				});
			}
		}
	],
}

module.exports = Github;