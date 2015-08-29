var Twit = require('twit');
var cache = require('memory-cache');
var handleError = require('../util/util');

var DEFAULT_CACHE_MSEC = 1000 * 60; // 60 seconds

var Twitter = {
  source: 'twitter',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('twitter');
        if (cachedResult) return res.json(cachedResult);

        this.Twitter.get('/statuses/user_timeline', { screen_name: this.me }, function(err, data) {
          if (err) return handleError(err, res);
          data = { tweets: data };
          cache.put('twitter', data, DEFAULT_CACHE_MSEC);
          res.json(data);
        });
      }
    }
  ],
  pre: function(data) {
    data.Twitter = new Twit(data.secrets);
  },
};

module.exports = Twitter;
