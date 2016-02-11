'use strict';

var expect = require('chai').expect;
var StatsD = require('node-dogstatsd').StatsD;
var DatadogEvent = require("./index");

describe('The event writer', function () {

    beforeEach(function(done) {
        this.server = require('dgram').createSocket("udp4");
        this.server.bind(8125, function() {
            done();
        });
    });

    afterEach(function(done) {
       this.server.close(function() {
           done();
       });
    });

    it('should write global tags and function tags', function (done) {
        this.server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal("_e{8,7}:My Title|My Text|#g1:1,g2:2,f1:1,f2:2");
            done();
        });

        var writer = new DatadogEvent(
            {"dogstatsd":new StatsD("localhost", 8125, null, {"global_tags": ["g1:1", "g2:2"]})}
        );
        writer.write("My Title", "My Text", {tags:["f1:1", "f2:2"]});
    });

    it('should write global tags only when no function tags', function (done) {
        this.server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal("_e{8,7}:My Title|My Text|#g1:1,g2:2");
            done();
        });

        var writer = new DatadogEvent(
            {"dogstatsd":new StatsD("localhost", 8125, null, {"global_tags": ["g1:1", "g2:2"]})}
        );
        writer.write("My Title", "My Text");
    });

    it('should write function tags only when no global tags', function(done) {
        this.server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal("_e{8,7}:My Title|My Text|#f1:1,f2:2");
            done();
        });

        var writer = new DatadogEvent(
            {"dogstatsd":new StatsD("localhost", 8125)}
        );
        writer.write("My Title", "My Text", {tags:["f1:1", "f2:2"]});
    });

    it('should not write tag information if non are given', function(done) {
        this.server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal("_e{8,7}:My Title|My Text|#");
            done();
        });

        var writer = new DatadogEvent(
            {"dogstatsd":new StatsD("localhost", 8125)}
        );
        writer.write("My Title", "My Text");
    });

});
