var foursquare = require('node-foursquare');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 10; // 10 mins

var getFoursquare = function(req, data) {
  var settings = { secrets: data.secrets };
  var redirectUrl = req.protocol + '://' + data.host + req.originalUrl + '/redirect';
  settings.secrets.redirectUrl = redirectUrl;
  return foursquare(settings);
};

var Foursquare = {
  type: 'location',
  source: 'foursquare',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('foursquare');
        if (cachedResult) return res.json(cachedResult);

        var accessToken = this.accessToken;
        if (!accessToken) return handleError('You have not specified an access Token yet', res);

        var fs = getFoursquare(req, this);
        fs.Users.getCheckins('self', {}, accessToken, function(err, checkins) {
          if (err) return handleError(err, res);
          cache.put('foursquare', checkins, DEFAULT_CACHE_MSEC);
          console.log('cache miss');
          res.json(checkins);
        });
      }
    },
    {
      method: 'GET',
      path: '/login',
      handler: function(req, res) {
        if (this.accessToken) return handleError('This user already has a valid access token', res);
        var fs = getFoursquare(req, this);
        res.redirect(fs.getAuthClientRedirectUrl());
      }
    },
    {
      method: 'GET',
      path: '/login/redirect',
      handler: function(req, res) {
        if (this.accessToken) return handleError('This user already has a valid access token', res);
        var fs = getFoursquare(req, this);
        fs.getAccessToken({ code: req.query.code }, function(err, accessToken) {
          if (err) return handleError(err, res);
          res.json({ token: accessToken });
        });
      }
    },
  ],
};

module.exports = Foursquare;
