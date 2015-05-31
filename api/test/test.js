var assert = require('assert');
var request = require('supertest');
var should = require('chai').should();

var app = require('../lib/app.js') ;
var me = require('../me.json');
var modules = require('../modules.json');

describe('GET /', function() {
    it('Responds with me.json', function(done) {
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
    it('Has routes specified in modules.json', function(done) {
        var routes = [];
        for (var moduleName in modules.modules) {
            var module = modules.modules[moduleName];
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

