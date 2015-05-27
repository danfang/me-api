# api-me
API Me is an open source, personal API built on Node that allows for extensible and flexible integrations. 

Check out an [example](http://api.danielfang.org) personal API. The endpoints are "/blog", "/code", "/location", "/photos", and "/twitter". 

Check out a [basic client](http://code.danielfang.org:4000/#/) for this API.

This is a central repository for your entire online profile. You get to host the content how you want - what endpoints you want exposed and what data you want accessible. If you're building a personal website, connect to your API and pull any data you want streamed to your website. API Me essentially detaches your public information from the social networking accounts they are tied to and aggregates them in a programmable, queriable fashion. Give and get access to your health, location, statuses, photos, blog posts, etc with full access-control over your content. 

These represent just a fraction of the opportunities available to you by making yourself programmable.

## Data Representation

Every endpoint is set up in two files: me.json, and modules.json. 

me.json is a file automatically hosted on the root path "/" and represents any information you want to expose about yourself, independent of any integrations you choose. 

Example me.json
```json
{
    "name":"Daniel Fang",
    "bio":"About me",
    "contact": {},
    "work": [],
    "projects": []
}
```

modules.json is where the fun starts. Using custom middleware (which I'll touch on later), you can attach the data pulled from various social media feeds to specific endpoints in your API. Some APIs will require authentication, so there is a section dedicated to getting the proper keys and redirect URIs set up for each integration below. You'll see that each module is associated with a "path" (what the endpoint for this integration will be) and various "data" fields required to authenticate yourself to these APIs.

Example modules.json
```json
{
	"medium": {
		"path": "/blog",
		"data": {
			"me": ""
		}
	}, 
	"twitter": {
		"path": "/twitter",
		"data": {
			"me": "",
			"secrets": {
				"consumer_key": "",
				"consumer_secret": "",
				"access_token": "",
				"access_token_secret": ""
			}
		}
	}, 
	"instagram": {
		"path": "/photos",
		"data": {
			"me": "",
			"host": "",
			"secrets": {
				"client_id": "",
				"client_secret": "",
				"access_token": ""
			}
		}
	}, 
	"foursquare": {
		"path": "/location",
		"data": {
			"host": "",
			"secrets": {
				"clientId": "",
				"clientSecret": ""
			},
			"accessToken": ""
		}
	}, 
	"github": {
		"path": "/code",
		"data": {
			"me": ""
		}
	}
}

```

## Server

```bash
npm start
```

This will run the API on port 3000. In the example above, you will get:
- / hosting "me.json"
- /blog running the Medium module
- /code running the Github module
- /location running the Foursquare module
- /photos running the Instagram module
- /twitter running the Twitter module

For a live demo, go to [my API](http://api.danielfang.org) to see the following integrations.
 
## External Client

In the client/ folder, there is a basic React+React Router application that makes AJAX calls to your own API. Note that for cross-domain calls to work, you need to amend api/app.js to allow a specific host for cross-domain calls. 

For a live demo, check out this [basic client](http://code.danielfang.org:4000/#/) to see the modules rendered in real time.

## Integration Guides

### Github

1. Enter in your github username to the "me" section in modules.json.

### Medium

1. Enter in your medium username with the @ symbol in the "me" section of modules.json

### Twitter

1. Go to the [Twitter Apps](https://apps.twitter.com/) page and create a new app.
2. After you've created an app (the specific settings are not important), go to the "Keys and Access Tokens" page.
3. Copy and paste the "Consumer Key", "Consumer Secret", "Access Token", and "Access Key" into the modules.json file as seen above under the "twitter" module".
4. Enter in your twitter username (without the @) as "me" in the "twitter" module.

### Instagram

1. Go to the [Instagram Clients](https://instagram.com/developer/clients/manage/) page and create a new client.
2. Make sure the "Redirect URI" field points to the "host" + "path" + "/login/redirect" in your modules.json file and that this is the same as where you are hosting your API. Look at this example configuration.
```json
"instagram": {
	"path": "/photos",
	"data": {
		"me": "myusername",
		"host": "http://api.foo.com",
		"secrets": {
			"client_id": "",
			"client_secret": "",
			"access_token": ""
		}
	}
} 
```
For this configuration, I am hosting the Instagram module at "http://api.foo.com/photos". Thus, the redirect URI I should enter for my app is "http://api.foo.com/photos/login/redirect".
4. Copy the "Client ID" and "Client Secret" into modules.json. 
5. Go to "http://api.foo.com/photos/login" and authorize your newly created app to get the access_token. 
6. Copy this access_token into modules.json to finish up your Instagram integration.

### Swarm by Foursquare

1. Go to the [Apps Page](https://foursquare.com/developers/apps) for Foursquare and create a new app.
2. On the app creation page, make sure the "Redirect URI" field points to the "host" + "path" + "/login/redirect" in your modules.json file and that this is the same as where you are hosting your API. Look at this example configuration.
```json
"foursquare": {
	"path": "/location",
	"data": {
		"host": "http://api.foo.com",
		"secrets": {
			"clientId": "",
			"clientSecret": ""
		},
		"accessToken": ""
	}
}, 
```
For this configuration, I am hosting the Swarm module at "http://api.foo.com/location". Thus, the redirect URI I should enter for my app is "http://api.foo.com/location/login/redirect".
3. Once you've set up your app, copy the "Client id" and "Client secret" from your app into modules.json in the appropriate "foursquare" module.
4. Once this is complete, visit "http://api.foo.com/location/login" to authorize usage of your newly created Foursquare app. 
5. Copy the newly returned access token into modules.json.
6. You can now start your server with the Foursquare integration!

Not Completed/Potential Integrations
- Runkeeper
- Venmo
- Fitbit

## Custom Middleware

The most powerful part of API Me is the possibility of making and using custom middleware for any kind of social media or analytics purposes (think Slack integrations). To do this, there is a specific format for middleware, shown below.

```javascript
var request = require('request');
var handleError = require('../util/util');
var cache = require('memory-cache');

var Github = {
	source: "github", // The name of your module, which will be referenced in modules.json
	
	// Below are all available routes for this piece of middleware. Notice the root "path" should be "", so that the user 
	// can mount this module on any path in modules.json. For example, if the user mounts this module on "/code",
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
				
				// Referencing "this" accesses the "data" object in modules.json. This is how to access
				// user-specified keys and usernames.
				var url = 'https://api.github.com/users/' + this.me + "/events/public";
				request({ url: url, headers: { 'User-Agent': this.me }}, function(err, response, body) {
					if (err || response.statusCode != 200) return handleError(err, res);
					var data = JSON.parse(body);
					cache.put('github', data, 1000 * 60 * 2);
					console.log('cache miss');
					return res.json(data);
				});
			}
		}
	],
}

module.exports = Github;
```
