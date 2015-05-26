var fs = require('fs');
var express = require('express');
var router = express.Router();

var me = JSON.parse(fs.readFileSync('me.json', 'utf8'));
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

var Me = function(me, settings) {
	this.router = express.Router();
	this.use = function(path, middleware) {
		if (!middleware.type || !middleware.source) {
			throw new Error("Middleware error: must require 'type' and 'source'");
		}

		if (!me[middleware.type] || !me[middleware.type][middleware.source]) {
			throw new Error("User error: me.json requires " + middleware.type + "." + middleware.source);
		}

		var data = {
			me: me[middleware.type][middleware.source],
			settings: settings,
		};

		if (middleware.pre) {
			middleware.pre(data);
		}

		for (var i in middleware.routes) {
			var route = middleware.routes[i];
			if (route.method == 'GET') {
				this.router.get(path + route.path, route.handler.bind(data));
			} else if (route.method == 'POST') {
				this.router.post(path + route.path, route.handler.bind(data));
			}
		}
	}
	this.router.get('/', function(req, res) {
		res.json(me);
	});

	var middleware = settings.use;
	for (var index in middleware) {
		var integration = middleware[index];
		this.use(integration.path, require("../middleware/" + integration.module));
		console.log("Using module: " + integration.module + " on " + integration.path);
	}
};

module.exports = new Me(me, settings);
