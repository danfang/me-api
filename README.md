# api-me
API Me is an open source, personal API that allows for extensible and flexible integrations. 

This is a central repository for your entire online profile. You get to host the content how you want - what endpoints you want exposed and what data you want accessible. If you're building a personal website, connect to your API and pull any data you want streamed to your website. API Me essentially detaches your public information from the social networking accounts they are tied to and aggregates them in a programmable, queriable fashion. Give and get access to your health, location, statuses, photos, blog posts, etc with full access-control over your content. 

## Data Representation

me.json
```json
{"me": {
    "name":"Daniel Fang",
    "bio":"About me",
    "contact": {
        "facebook":
        ...
    },
    "work": [...],
    "projects": [...]
}
```

modules.json
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

This will run the API on port 3000.

### Endpoints

Done

| HTTP Verb | Path | Description |
| --------- | ---- | ----------- |
| GET | / | Basic overview |
| GET | /blog | Recent Medium blog posts |
| GET | /blog/:index | Specific blog posts |
| GET | /code | Latest Github events |
| GET | /twitter | Latest Tweets |

TBD

| HTTP Verb | Path | Description |
| --------- | ---- | ----------- |
| GET | /twitter/followers | Twitter followers |
| GET | /posts | Facebook Posts | 
| GET | /health | Summary of Fitbit, Runkeeper, etc |
| GET | /schedule | Calendars |
| GET | /location | Last known location |
| POST | /pay | Payment portal |
| POST | /message | Messaging system |
 
## Client-interface

## External Client

## Integrations
- Facebook
- Twitter
- Instagram
- Github
- Fitbit
- Runkeeper
- Venmo
