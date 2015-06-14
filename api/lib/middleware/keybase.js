var request = require('request');
var handleError = require('../util/util');
var cache = require('memory-cache');

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var Keybase = {
    source: "keybase",
    routes: [
        {
            method: "GET",
            path: "",
            handler: function(req, res) {
                var cachedResult = cache.get('keybase');
                if (cachedResult) return res.json(cachedResult);
                
                var url = 'https://keybase.io/_/api/1.0/user/lookup.json?usernames=' + this.me;
                request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
                    if (err || response.statusCode != 200) return handleError(err, res);
                    var data = JSON.parse(body);
                    cache.put('keybase', data.them, DEFAULT_CACHE_MSEC);
                    console.log('cache miss');
                    return res.json(data.them);
                });
            }
        }
    ],
}

module.exports = Keybase;