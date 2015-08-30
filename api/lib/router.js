var express = require('express');

// This is the extensibility portion of Me API, where you can bind a list of
// modules from config.json and me.json to any given endpoint.
module.exports = (function() {
  function ApiRouter(me, modules, settings) {
    this.router = express.Router();
    this.modules = modules;
    this.settings = settings;
    this.routes = [];

    this.router.get('/', function(req, res) {
      res.json({ me: me, routes: this.routes });
    }.bind(this));

    this.initialize(modules);
  }

  ApiRouter.prototype.initialize = function(modules) {
    for (var moduleName in modules) {
      var config = modules[moduleName]; // configuration object for each module
      this.useModule(moduleName, config);
    }
  };

  ApiRouter.prototype.useModule = function(name, config) {
    var data = config.data;
    var path = config.path;
    var module = config.custom ? require(name) : require('./middleware/' + name);
    data.host = this.settings.host; // used for various hooks and callback URIs

    if (module.pre) {
      module.pre(data); // Preprocesses data if given a pre() function
    }

    this.mountModuleRoutes(path, module.routes, data);
    this.routes.push(path);
    console.log('Using module: ' + name + ' on ' + path);
  };

  ApiRouter.prototype.mountModuleRoutes = function(path, moduleRoutes, data) {
    moduleRoutes.forEach(function(route) {
      var endpoint = path + route.path;
      if (route.method == 'GET') {
        this.router.get(endpoint, route.handler.bind(data));
      } else if (route.method == 'POST') {
        this.router.post(endpoint, route.handler.bind(data));
      }
    }, this);
  };

  return ApiRouter;
})();
