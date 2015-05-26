# api-me
Open source personal API with custom integrations

## Data Representation

me.json
```json
{
    "name": "Daniel Fang",
    "bio": "Student @ UW CSE & Software Engineering Intern @ Wealthfront",
    "blog": {
        "medium": "@danfang"
    },
    "code": {
        "github": "danfang"
    },
    "social": {
        "twitter": "thedanfang"
    }
}
```

settings.json
```json
{
    "twitter": {
        "consumer_key": "",
        "consumer_secret": "",
        "access_token": "",
        "access_token_secret": ""
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
