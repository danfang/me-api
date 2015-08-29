var path = require('path');
var assert = require('assert');
var request = require('supertest');
var mock = require('proxyquire');
var should = require('chai').should();
var cwd = process.cwd();

var me = { name: 'Test User' };
var config = { 
    settings: { host: 'localhost' },
    modules: {
        medium: {
            path: '/path',
            data: { me: 'user' }
        }
    }
};

var stubs = {};
stubs[path.join(cwd, './me')] = me;
stubs[path.join(cwd, './config')] = config;
mock('../lib/routes/router', stubs);

var app = require('../lib/app.js') ;

describe('GET /', function() {
    it('Responds with values of ./me', function(done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function(res) {
                res.body.should.have.property('me');
                res.body.me.should.deep.equal(me);
            })
            .end(done);
    });
    it('Has routes specified in ./modules', function(done) {
        var routes = [];
        for (moduleName in config.modules) {
            var module = config.modules[moduleName];
            routes.push(module.path);
        }
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function(res) {
                res.body.should.have.property('routes');
                res.body.routes.should.deep.equal(routes);
            })
            .end(done);
    });
});
