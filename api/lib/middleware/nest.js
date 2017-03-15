var request = require('request');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60; // 60 seconds
var NEST_API_URL = 'https://developer-api.nest.com';

var Nest = {
  source: 'nest',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('nest');
        if (cachedResult) return res.json(cachedResult);

        var url = NEST_API_URL + '/devices/thermostats/' +
                  this.secrets.device_id + '?auth=' +
                  this.secrets.access_token;

        var requestOpts = { url: url, headers: { 'Accept': 'application/json' } };
        request(requestOpts, function(err, response, body) {
          if (err || response.statusCode != 200) return handleError(err, res);
          var data = JSON.parse(body);
          cache.put('nest', data, DEFAULT_CACHE_MSEC);
          return res.json(data);
        });
      }
    }
  ]
};

module.exports = Nest;
