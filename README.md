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

Done:
GET /
GET /blog
GET /blog/:index
GET /code
GET /twitter
GET /twitter/followers

TBD:
GET /posts
GET /health
GET /location

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
