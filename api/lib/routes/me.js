var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var cwd = process.cwd();

var me = require(path.join(cwd, './me'));
var modules = require(path.join(cwd, './modules'));

// This is the extensibility portion of Me API, where you can bind a list of
// modules from modules.json and me.json to any given endpoint.
var Me = function(me, modules) {
	this.router = express.Router();
	this.routes = [];

	// Function that reads data from modules.json, mounts it on a specified path,
	// and binds given data to that request.
	this.use = function(path, middleware) {
		var data = modules.modules[middleware.source].data;
		data.host = modules.settings.host;

		// Preprocesses data if there is a given pre() function in the module.
		if (middleware.pre) {
			middleware.pre(data);
		}

		this.routes.push(path);

		for (var i in middleware.routes) {
			var route = middleware.routes[i];
			var endpoint = path + route.path;

			// Mount the middleware handler on a given path
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
		if (settings.custom) {
			this.use(settings.path, require(module));
			console.log("Using custom module: " + module + " on " + settings.path);
		} else {
			this.use(settings.path, require("../middleware/" + module));
			console.log("Using standard module: " + module + " on " + settings.path);
		}
	}
};

module.exports = new Me(me, modules);
