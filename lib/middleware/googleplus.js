var google = require('googleapis');
var gplus = google.plus('v1');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins
var PROFILE_CACHE_MSEC = 1000 * 60 * 60; // 1 hour

var GooglePlus = {
  source: 'googleplus',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('googleplus_profile');
        if (cachedResult) return res.json(cachedResult);
        if (!this.apikey) return handleError('You have to specify an API-Key', res);

        gplus.people.get({ key: this.apikey, userId: this.me }, function(err, user) {
          if (err) return handleError(err, res);
          var data = user;
          cache.put('googleplus_profile', data, PROFILE_CACHE_MSEC);
          res.json(data);
        });
      }
    },
    {
      method: 'GET',
      path: '/posts',
      handler: function(req, res) {
        var pageToken = req.query.pageToken || '';
        var cacheKey = 'googleplus_posts_' + pageToken;
        var cachedResult = cache.get(cacheKey);
        if (cachedResult) return res.json(cachedResult);
        if (!this.apikey) return handleError('You have to specify an API-Key', res);
        var opts = {
          key: this.apikey,
          userId: this.me,
          collection: 'public',
          pageToken: pageToken
        };
        gplus.activities.list(opts, function(err, posts) {
          if (err) return handleError(err, res);
          var data = posts;
          cache.put(cacheKey, data, DEFAULT_CACHE_MSEC);
          res.json(data);
        });
      }
    }
  ],
};

module.exports = GooglePlus;
