var request = require('request');
var handleError = require('../util/util');
var cache = require('memory-cache');

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var Mixcloud = {
  source: 'mixcloud',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('mixcloud');
        if (cachedResult) return res.json(cachedResult);

        var url = 'http://api.mixcloud.com/' + this.me + '/feed/';
        request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
          if (err || response.statusCode != 200) return handleError(err, res);
          var data = JSON.parse(body);
          cache.put('mixcloud', data, DEFAULT_CACHE_MSEC);
          return res.json(data);
        });
      }
    }
  ],
};

module.exports = Mixcloud;
