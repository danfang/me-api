var google = require('googleapis');
var gplus = google.plus('v1');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins
var PROFILE_CACHE_MSEC = 1000 * 60 * 60; // 1 hour

var GooglePlus = {
        source: "googleplus",
        routes: [
            {
                method: "GET",
                path: "",
                handler: function(req, res) {
                    var cachedResult = cache.get('googleplus_profile');
                    if (cachedResult) return res.json(cachedResult);

                    if (!this.apikey) return handleError("You have to specify an API-Key", res);

                    gplus.people.get({ key: this.apikey, userId: this.me }, function(err, user) {
                        if (err) return handleError(err, res);
                        var data = user;
                        cache.put('googleplus_profile', data, PROFILE_CACHE_MSEC);
                        console.log('cache miss');
                        res.json(data);
                    });
                }
            },
            {
                method: "GET",
                path: "/posts",
                handler: function(req, res) {
                    var cachedResult = cache.get('googleplus_posts');
                    if (cachedResult) return res.json(cachedResult);

                    if (!this.apikey) return handleError("You have to specify an API-Key", res);

                    gplus.activities.list({ key: this.apikey, userId: this.me, collection: 'public' }, function(err, posts) {
                        if (err) return handleError(err, res);
                        var data = posts;
                        cache.put('googleplus_posts', data, DEFAULT_CACHE_MSEC);
                        console.log('cache miss');
                        res.json(data);
                    });
                }
            }
    ],
};

module.exports = GooglePlus;