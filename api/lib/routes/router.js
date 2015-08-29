var express = require('express');

// This is the extensibility portion of Me API, where you can bind a list of
// modules from config.json and me.json to any given endpoint.
module.exports = function(me, modules, settings) {
  this.router = express.Router();
  this.modules = modules;
  this.settings = settings;
  this.routes = [];

  // Function that reads data from modules.json, mounts it on a specified path,
  // and binds given data to that request.
  this.useModule = function(path, module) {
    var data = this.modules[module.source].data;
    data.host = this.settings.host;

    // Preprocesses data if there is a given pre() function in the module.
    if (module.pre) module.pre(data);

    this.routes.push(path);
    this.mountModuleRoutes(path, module.routes, data);
  };

  this.mountModuleRoutes = function(path, moduleRoutes, data) {
    moduleRoutes.forEach(function(route) {
      var endpoint = path + route.path;
      if (route.method == 'GET') {
        this.router.get(endpoint, route.handler.bind(data));
      } else if (route.method == 'POST') {
        this.router.post(endpoint, route.handler.bind(data));
      }
    }, this);
  };

  this.initialize = function(modules) {
    for (var moduleName in modules) {
      var settings = modules[moduleName];
      if (settings.custom) {
        this.useModule(settings.path, require(moduleName));
        console.log('Using custom module: ' + moduleName + ' on ' + settings.path);
      } else {
        this.useModule(settings.path, require('../middleware/' + moduleName));
        console.log('Using standard module: ' + moduleName + ' on ' + settings.path);
      }
    }
  };

  this.router.get('/', function(req, res) {
    res.json({ me: me, routes: this.routes });
  }.bind(this));

  this.initialize(modules);
};
