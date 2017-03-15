# Me API


[![NPM version](https://img.shields.io/npm/v/me-api-server.svg?style=flat)](https://www.npmjs.com/package/me-api-server)
[![Build Status](https://travis-ci.org/danfang/me-api.svg?branch=master)](https://travis-ci.org/danfang/me-api)

Me API is a __personal API__ built on Node.js that allows for __extensible integrations__.

Check out an [example](http://api.danielfang.org) personal API. The endpoints are [/blog](http://api.danielfang.org/blog), [/code](http://api.danielfang.org/code), [/location](http://api.danielfang.org/location), [/photos](http://api.danielfang.org/photos), [/twitter](http://api.danielfang.org/twitter), [/btc](http://api.danielfang.org/btc), [/keybase](http://api.danielfang.org/keybase), and [/gplus](http://api.danielfang.org/gplus).

Check out a [basic client](http://danielfang.org) for this API.

This is a central repository for your entire online profile. You get to host the content how you want - what endpoints you want exposed and what data you want accessible.

If you're building a personal website, connect to your API and pull any data you want streamed to your website. Me API essentially detaches your public information from the social networking accounts they live on and aggregates them in a programmable fashion. Give and get access to your health, location, statuses, photos, blog posts, [anything] with full access-control over your content.

## Data Representation

Our API endpoints are set up in two files: me.json, and config.json.

me.json is a JSON object automatically hosted on the root path "/" and represents any information you want to expose about yourself, independent of any integrations you choose.

Simple me.json
```json
{
    "name":"Daniel Fang"
}
```

config.json is where the fun starts. Using [custom middleware](#custom-middleware), you can attach the data pulled from various social media feeds to specific endpoints in your API. Some APIs will require authentication, so there is a [section](#integration-guides) dedicated to getting the proper keys and redirect URIs set up for each integration below. You'll see that each module is associated with a "path" (what the endpoint for this integration will be) and various "data" fields required to authenticate yourself to these APIs. Over time, this process will be streamlined.

Simple config.json
```json
 {
     "settings": {
         "host": "localhost:3000"
     },
     "modules": {
         "medium": {
             "path": "/blog",
             "data": {
                 "me": "@myusername"
             }
         },
         "github": {
             "path": "/code",
             "data": {
                 "me": "myusername"
             }
         }
     }
 }
```

## Installing and Running

```bash
(sudo) npm install -g me-api-server

me-api-init ; Runs a Python script to help create me.json and config.json
...

me-api-server [port] -m <me.json file> -c <config.json file> ; Run the API server on port [port]
```

This will run the API on given port. Using the config.json (in the directory you're running the server from) in the example above, you will get:
- / hosting "me.json"
- /blog running the Medium module
- /code running the Github module

For a live demo, go to [my API](http://api.danielfang.org) to see more integrations.

## External Client

In the client/ folder, there is a basic React application that makes AJAX calls to your own API. This Cross-Domain access is allowed by default.

For a live demo, check out this [basic client](http://danielfang.org/) to see the modules rendered in real time.

## Integration Guides

### Github

1. Enter in your github username as the "me" field in config.json
```json
"github": {
	"path": "/code",
	"data": {
		"me": "username"
	}
}
```

### Medium

1. Enter in your medium username with the @ symbol as the "me" field in config.json
```json
"medium": {
	"path": "/blog",
	"data": {
		"me": "@username"
	}
},
```

### Twitter

1. Go to the [Twitter Apps](https://apps.twitter.com/) page and create a new app.
2. After you've created an app (the specific settings are not important), go to the "Keys and Access Tokens" page.
3. Copy and paste the "Consumer Key", "Consumer Secret", "Access Token", and "Access Key" into the config.json file as seen above under the "twitter" module".
4. Enter in your twitter username (without the @) as "me" in config.json

```json
"twitter": {
	"path": "/twitter",
	"data": {
		"me": "username",
		"secrets": {
			"consumer_key": "aaa",
			"consumer_secret": "bbb",
			"access_token": "ccc",
			"access_token_secret": "ddd"
		}
	}
}
```

### Instagram

1. Go to the [Instagram Clients](https://instagram.com/developer/clients/manage/) page and create a new client.
2. On the app creation page, make sure the "Redirect URI" field points to [settings.host] + [instagram.path] + "/login/redirect" in your config.json file and that this is the same host as where you are hosting your API.
```json
"settings": {
	"host": "api.foo.com"
},
"modules": {
	...
	"instagram": {
		"path": "/photos",
		"data": {
			"me": "username",
			"secrets": {
				"client_id": "aaa",
				"client_secret": "bbb",
				"access_token": "ccc"
			}
		}
	}
}
```
For this configuration, I am hosting the Instagram module at "http://api.foo.com/photos". Thus, the redirect URI I should enter for my app is "http://api.foo.com/photos/login/redirect".
4. After the app is set up, copy the "Client ID" and "Client Secret" into config.json.
5. Go to "http://api.foo.com/photos/login" and authorize your newly created app to get the access_token.
6. Copy this access_token into config.json to finish up your Instagram integration.

### Swarm by Foursquare

1. Go to the [Apps Page](https://foursquare.com/developers/apps) for Foursquare and create a new app.
2. On the app creation page, make sure the "Redirect URI" field points to [settings.host] + [foursquare.path] + "/login/redirect" in your config.json file and that this is the same host as where you are hosting your API.
```json
"settings": {
	"host": "api.foo.com"
}
"modules": {
	...
	"foursquare": {
		"path": "/location",
		"data": {
			"secrets": {
				"clientId": "aaa",
				"clientSecret": "bbb"
			},
			"accessToken": "ccc"
		}
	},
}
```
For this configuration, I am hosting the Foursquare module at "http://api.foo.com/location". Thus, the redirect URI I should enter for my app is "http://api.foo.com/location/login/redirect".
3. Once you've set up your app, copy the "Client id" and "Client secret" from your app into config.json in the appropriate "foursquare" module.
4. Once this is complete, visit "http://api.foo.com/location/login" to authorize usage of your newly created Foursquare app.
5. Copy the newly returned access token into config.json to finish integrating Foursquare.

### Coinbase

1. Go to your Coinbase Account Settings and generate an API Key+Secret pair
2. Allow "transactions" and "addresses" in the key settings.
3. Fill out config.json
```json
"coinbase": {
    "path": "/btc",
    "data": {
        "secrets": {
            "apiKey": "aaa",
            "apiSecret": "bbb"
        },
        "accountName": "My Wallet"
    }
}
```

### Keybase

1. Enter in your keybase username as the "me" field in config.json
```json
"keybase": {
    "path": "/encrypt",
    "data": {
        "me": "username"
    }
}
```

### Google+

1. Enter in your Google+ canonical name (if exists) or user-id as the "me" field in config.json
```json
"googleplus": {
    "path": "/social",
    "data": {
        "apikey": "Your API-Key",
        "me": "+username"
    }
}
```


Not Completed/Potential Integrations
- Runkeeper
- Venmo
- Fitbit

## Custom Middleware

The most powerful part of API Me is the possibility of making and using custom middleware for any kind of social media or analytics purposes (think Slack integrations). To do this, there is a specific format for middleware, shown below. To see their implementations, clone the repo - they live in the api/lib/middleware directory.

```javascript
var request = require('request');
var cache = require('memory-cache');
var handleError = require('../util/util');

var Github = {
	source: "github", // The name of your module, which will be referenced in config.json

	// Below are all available routes for this piece of middleware. Notice the root "path" should be "", so that the user
	// can mount this module on any path in config.json. For example, if the user mounts this module on "/code",
	// the following route will handle "/code" and an additional route with path "/stats" will handle "/code/stats".
	routes: [
		{
			method: "GET",
			path: "",
			// The handler operates like any normal express route with a request, response, and next.
			handler: function(req, res) {
				// Leveraging caches is important to not exceed rate limits on various APIs
				var cachedResult = cache.get('github');
				if (cachedResult) return res.json(cachedResult);

				// Referencing "this" accesses the "data" object in config.json. This is how to access
				// user-specified keys and usernames.
				var url = 'https://api.github.com/users/' + this.me + "/events/public";
				request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					var data = JSON.parse(body);
					cache.put('github', data, 1000 * 60 * 2);
					return res.json(data);
				});
			}
		}
	],
}

module.exports = Github;
```
