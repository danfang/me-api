var API_URL = "http://api.danielfang.org/";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div className="container">
        <header id="nav">
          <ul>
            <li><Link to="app">Home</Link></li>
            <li><Link to="blog">Blog</Link></li>
            <li><Link to="code">Code</Link></li>
          </ul>
        </header>

        <RouteHandler/>

        <footer>
        	<p>Made with Me API &amp; React &amp; Sass</p>
        </footer>
      </div>
    );
  }
});

var Home = React.createClass({
	getInitialState: function() {
		return { me: null, tweets: [], checkins: [] };
	},
	componentDidMount: function() {
		$.get(API_URL, function(data) {
			console.log(data);
			this.setState({ me: data.me });
		}.bind(this));

		$.get(API_URL + "twitter", function(data) {
			console.log(data);
			this.setState({ tweets: data.tweets });
		}.bind(this));

		$.get(API_URL + "location", function(data) {
			console.log(data);
			this.setState({ checkins: data.checkins.items });
		}.bind(this));
	},
	render: function() { 
		var me = this.state.me;
		if (!me) return <div></div>;
		var checkinNode = this.state.checkins.length ? <Checkin checkin={this.state.checkins[0]} /> : "";
		var tweetNode = this.state.tweets.length ? <Tweet tweet={this.state.tweets[0]} /> : "";
		return (
			<div id="home">
				<div className="overview">
					<h2>{me.name}</h2>
					<p>{me.bio}</p>
				</div>
				<div id="latest-checkin">
					{checkinNode}
				</div>
				<div id="latest-tweet">
					{tweetNode}
				</div>
			</div>
		);
	}}
);

var Checkin = React.createClass({
	render: function() {
		var checkin = this.props.checkin;
		return (
			<div className="checkin media">
				<div className="media-left">
					<i className="fa fa-2x fa-map-marker"></i>
				</div>
				<div className="media-body">
					<p className="location">{checkin.venue.name}</p>
					<p className="shout">{checkin.shout}</p>
					<p className="date">{moment(checkin.createdAt * 1000).fromNow()}</p>
				</div>
			</div>
		);
	}
})

var Tweet = React.createClass({
	render: function() {
		var tweet = this.props.tweet;
		return (
			<div className="tweet media">
				<div className="media-left">
					<i className="fa fa-2x fa-twitter"></i>
				</div>
				<div className="media-body">
					<p className="screenName">@{tweet.user.screen_name}</p>
					<p className="text">{tweet.text}</p>
					<p className="date">{moment(tweet.created_at).fromNow()}</p>
				</div>
			</div>
		);
	}
})

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
			if (event.type == 'WatchEvent') return <WatchEvent event={event} />;
			if (event.type == 'CreateEvent') return <CreateEvent event={event} />;
			if (event.type == 'PushEvent') return <PushEvent event={event} />;
		})
		return <div id="code">{eventNodes}</div>
	}}
);

var WatchEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-star fa-lg"></i>
					Starred <a href={"https://github.com/" + repo.name}>{repo.name}</a>
				</p>
				<p className="date">{moment(event.created_at).fromNow()}</p>
			</div>
		);
	}
});

var CreateEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-code-fork fa-lg"></i>
					Created {event.payload.ref_type} {event.payload.ref} in
					<a href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="date">{moment(event.created_at).fromNow()}</p>
			</div>
		);
	}
});

var PushEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-code fa-lg"></i>
					Pushed {event.payload.commits.length} commit{event.payload.commits.length == 1 ? "" : "s"} to
					<a href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="commit">Branch {event.payload.ref} at {event.payload.head}</p>
				<p className="date">{moment(event.created_at).fromNow()}</p>
			</div>
		);
	}
});
var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="blog" handler={Blog}/>
    <Route name="code" handler={Code}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});