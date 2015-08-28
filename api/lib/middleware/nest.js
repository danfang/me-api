var request = require('request');
var cache = require('memory-cache');
var handleError = require('../util/util');

var DEFAULT_CACHE_MSEC = 1000 * 60; // 60 seconds

var Nest = {
    source: "nest",
    routes: [
        {
            method: "GET",
            path: "",
            handler: function(req, res) {
                var cachedResult = cache.get('nest');
                if (cachedResult) return res.json(cachedResult);
				
				console.log(this.secrets);
				
				var url = 'https://developer-api.nest.com/devices/thermostats/' + this.secrets.device_id + '?auth=' + this.secrets.access_token
				request({ url: url, headers: { 'Accept': 'application/json' }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					var data = JSON.parse(body);
					cache.put('github', data, DEFAULT_CACHE_MSEC);
					console.log('cache miss');
					return res.json(data);
				});
            }
        }
    ]
}

module.exports = Nest;