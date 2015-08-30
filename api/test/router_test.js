var should = require('chai').should();
var sinon = require('sinon');
var express = require('express');
var mockery = require('mockery');
var ApiRouter = require('../lib/router');

describe('router', function() {
  var me;
  var modules;
  var settings;

  before(function() {
    modules = {};
    settings = { host: 'localhost' };
    me = { name: 'Test User' };
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false
    });
  });

  after(function() {
    mockery.disable();
  });

  describe('#constructor', function() {
    it('sets all the instance variables', function() {
      var router = new ApiRouter(me, modules, settings);
      router.router.should.not.be.empty;
      router.modules.should.equal(modules);
      router.settings.should.equal(settings);
      router.routes.should.deep.equal([]);
    });

    it('initializes the router with a list of modules', function() {
      var initSpy = sinon.spy(ApiRouter.prototype, 'initialize');
      new ApiRouter(me, modules, settings);
      initSpy.withArgs(modules).calledOnce.should.be.true;
      ApiRouter.prototype.initialize.restore();
    });

    it('mounts a page on the root directory /', function() {
      var getSpy = sinon.spy(express.Router, 'get');
      new ApiRouter(me, modules, settings);
      getSpy.withArgs('/').calledOnce.should.be.true;
      express.Router.get.restore();
    });
  });

  describe('#initialize', function() {
    it('should call useModule on each module passed', function() {
      var name = 'module';
      var config = { path: '/path' };
      var useStub = sinon.stub(ApiRouter.prototype, 'useModule').withArgs(name, config);
      var spy = sinon.spy(useStub);
      ApiRouter.prototype.initialize({ 'module': config });
      spy.withArgs(name, config).calledOnce.should.be.true;
      ApiRouter.prototype.useModule.restore();
    });
  });

  describe('#useModule', function() {
    it('should mount each route in the module config and add it to routes', function() {
      var router = new ApiRouter(me, modules, settings);
      var mountSpy = sinon.spy(ApiRouter.prototype, 'mountModuleRoutes');
      var routes = [{ method: 'GET', path: '', handler: function() {} }];
      mockery.registerMock('./middleware/no-pre', { source: 'module', routes: routes });
      router.useModule('no-pre', { path: '/path', data: {} });
      mountSpy.withArgs('/path', routes).calledOnce.should.be.true;
      router.routes.should.deep.equal(['/path']);
      ApiRouter.prototype.mountModuleRoutes.restore();
    });

    it('should call #pre if the provided module has a pre function', function() {
      var router = new ApiRouter(me, modules, settings);
      var routes = [{ method: 'GET', path: '', handler: function() {} }];
      var preSpy = sinon.spy();
      mockery.registerMock('./middleware/with-pre', {
        source: 'module', routes: routes, pre: preSpy
      });
      router.useModule('with-pre', { path: '/path', data: 'data' });
      preSpy.withArgs('data').calledOnce.should.be.true;
    });
  });

  describe('#mountModuleRoutes', function() {
    it('should mount routes on the proper endpoints', function() {
      var router = new ApiRouter(me, modules, settings);
      var getSpy = sinon.spy(express.Router, 'get');
      var postSpy = sinon.spy(express.Router, 'post');
      var routes = [
        { method: 'GET', path: '/get', handler: function() {} },
        { method: 'POST', path: '/post', handler: function() {} },
      ];
      router.mountModuleRoutes('/path', routes, 'data');
      getSpy.withArgs('/path/get').calledOnce.should.be.true;
      postSpy.withArgs('/path/post').calledOnce.should.be.true;
      express.Router.get.restore();
      express.Router.post.restore();
    });
  });
});
