var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var cwd = process.cwd();

var me = require(path.join(cwd, './me'));
var modules = require(path.join(cwd, './modules'));

var Me = function(me, modules) {
	this.router = express.Router();
	this.routes = [];
	this.use = function(path, middleware) {
		var data = modules.modules[middleware.source].data;
		data.host = modules.settings.host;

		if (middleware.pre) {
			middleware.pre(data);
		}

		this.routes.push(path);

		for (var i in middleware.routes) {
			var route = middleware.routes[i];
			var endpoint = path + route.path;
			if (route.method == 'GET') {
				this.router.get(endpoint, route.handler.bind(data));
			} else if (route.method == 'POST') {
				this.router.post(endpoint, route.handler.bind(data));
			}
		}
	};
	this.router.get('/', function(req, res) {
		res.json({ me: me, routes: this.routes });
	}.bind(this));

	for (var module in modules.modules) {
		var settings = modules.modules[module];
		this.use(settings.path, require("../middleware/" + module));
		console.log("Using module: " + module + " on " + settings.path);
	}
};

module.exports = new Me(me, modules);
