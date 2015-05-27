var API_URL = "http://api.danielfang.org/";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="app">Home</Link></li>
            <li><Link to="blog">Blog</Link></li>
            <li><Link to="code">Code</Link></li>
            <li><Link to="tweets">Tweets</Link></li>
            <li><Link to="checkins">Checkins</Link></li>
            <li><Link to="photos">Photos</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var Home = React.createClass({
	getInitialState: function() {
		return { me: null };
	},
	componentDidMount: function() {
		$.get(API_URL, function(data) {
			console.log(data);
			this.setState({ me: data.me });
		}.bind(this));
	},
	render: function() { 
		var me = this.state.me;
		if (!me) return <div></div>;
		return (
			<div>
				<h1>Home</h1>
				<h2>{me.name}</h2>
				<p>{me.bio}</p>
			</div>
		);
	}}
);

var Blog = React.createClass({
	getInitialState: function() {
		return { posts: [] };
	},
	componentDidMount: function() {
		$.get(API_URL + "blog", function(data) {
			console.log(data);
			this.setState({ posts: data });
		}.bind(this));
	},
	render: function() { 
		if (!this.state.posts.length) return <div></div>;
		var postNodes = this.state.posts.map(function(post, index) {
			var paragraphs = post.previewContent.bodyModel.paragraphs;
			var paragraphNodes = paragraphs.map(function(paragraph) {
				return <p>{paragraph.text}</p>;
			});
			return <div>{paragraphNodes}</div>;
		});
		return (
			<div>
				<h1>Blog</h1>
				{postNodes}
			</div>
		);
	}}
);

var Code = React.createClass({	
	getInitialState: function() {
		return { events: [] };
	},
	componentDidMount: function() {
		$.get(API_URL + "code", function(data) {
			console.log(data);
			this.setState({ events: data });
		}.bind(this));
	},
	render: function() { 
		if (!this.state.events.length) return <div></div>;
		var eventNodes = this.state.events.map(function(event) {
			return (
				<div>
					<h2>{event.type}</h2>
					<a href={"https://github.com/"+ event.repo.name}><p>{event.repo.name}</p></a>
					<p>{(new Date(event.created_at)).toDateString()}</p>
				</div>
			);
		})
		return <div><h1>Code</h1>{eventNodes}</div>
	}}
);

var Tweets = React.createClass({
	getInitialState: function() {
		return { tweets: [] };
	},
	componentDidMount: function() {
		$.get(API_URL + "twitter", function(data) {
			console.log(data);
			this.setState({ tweets: data.tweets });
		}.bind(this));
	},
	render: function() { 
		if (!this.state.tweets.length) return <div></div>;
		var tweetNodes = this.state.tweets.map(function(tweet) {
			return (
				<div>
					<h2>{tweet.text}</h2>
					<p>Created at {(new Date(tweet.created_at)).toDateString()}</p>
				</div>
			);
		});
		return <div><h1>Tweets</h1>{tweetNodes}</div>
	}}
);

var Checkins = React.createClass({
	getInitialState: function() {
		return { checkins: [] };
	},
	componentDidMount: function() {
		$.get(API_URL + "location", function(data) {
			console.log(data);
			this.setState({ checkins: data.checkins.items });
		}.bind(this));
	},
	render: function() { 		
		if (!this.state.checkins.length) return <div></div>;
		var checkinNodes = this.state.checkins.map(function(checkin) {
			return (
				<div>
					<h2>{checkin.shout}</h2>
					<p>{checkin.type}</p>
					<p>{checkin.venue.name}</p>
					<p>{checkin.venue.location.city} {checkin.venue.location.state}</p>
					<p>{(new Date(checkin.createdAt * 1000)).toDateString()}</p>
				</div>
			);
		});
		return <div><h1>Checkins</h1>{checkinNodes}</div>
	}}
);

var Photos = React.createClass({
	componentDidMount: function() {
		$.get(API_URL + "photos", function(data) {
			console.log(data);
		});
	},
	render: function() { 
		return <div>Photos</div>
	}}
);

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="blog" handler={Blog}/>
    <Route name="code" handler={Code}/>
    <Route name="tweets" handler={Tweets}/>
    <Route name="checkins" handler={Checkins}/>
    <Route name="photos" handler={Photos}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});