'use strict';

const expect = require('chai').expect;
const StatsD = require('node-dogstatsd').StatsD;
const DatadogEvent = require("../index");

describe('The event writer tags option', function () {

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
        setMessageExpectation("_e{8,7}:My Title|My Text|#g1:1,g2:2,f1:1,f2:2", this.server, done);

        aDatadogEvent()
            .withGlobalTags(["g1:1", "g2:2"])
            .write("My Title", "My Text", {tags:["f1:1", "f2:2"]});
    });

    it('should write global tags only when no function tags', function (done) {
        setMessageExpectation("_e{8,7}:My Title|My Text|#g1:1,g2:2", this.server, done);

        aDatadogEvent()
            .withGlobalTags(["g1:1", "g2:2"])
            .write("My Title", "My Text");
    });

    it('should write function tags only when no global tags', function (done) {
        setMessageExpectation("_e{8,7}:My Title|My Text|#f1:1,f2:2", this.server, done);

        aDatadogEvent()
            .withNoGlobalTags()
            .write("My Title", "My Text", {tags:["f1:1", "f2:2"]});
    });

    it('should not write tag information if non are given', function (done) {
        setMessageExpectation("_e{8,7}:My Title|My Text", this.server, done);

        aDatadogEvent()
            .withNoGlobalTags()
            .write("My Title", "My Text");
    });


    function aDatadogEvent() {
        return {
            withGlobalTags: function(global_tags) {
                return new DatadogEvent(
                    {"dogstatsd":new StatsD("localhost", 8125, null, {"global_tags": global_tags})});
            },

            withNoGlobalTags: function() { return this.withGlobalTags([]) }
        }
    }

    function setMessageExpectation(message, server, done){
        server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal(message);
            done();
        });
    }
});
