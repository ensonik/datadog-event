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

    it('should write date happened', function (done) {
        setMessageExpectation("_e{1,1}:a|b|d:12321312312", this.server, done);

        (new DatadogEvent()).write("a", "b", {date_happened:12321312312});
    });

    it('should not write date happened when value is non numeric', function (done) {
        setMessageExpectation("_e{1,1}:a|b", this.server, done);

        (new DatadogEvent()).write("a", "b", {date_happened:'a'});
    });

    it('should write host name information', function (done) {
        setMessageExpectation("_e{1,1}:a|b|h:myhost", this.server, done);

        (new DatadogEvent()).write("a", "b", {host_name:"myhost"});
    });

    it('should write priority information', function (done) {
        setMessageExpectation("_e{1,1}:a|b|p:normal", this.server, done);

        (new DatadogEvent()).write("a", "b", {priority:"normal"});
    });

    it('should write alert type information', function (done) {
        setMessageExpectation("_e{1,1}:a|b|t:info", this.server, done);

        (new DatadogEvent()).write("a", "b", {alert_type:"info"});
    });

    it('should write all information', function (done) {
        setMessageExpectation("_e{1,1}:a|b|d:12038123|h:myhost|p:low|t:info|#gt1:1,t1:1,t2:2", this.server, done);

        var de = new DatadogEvent({"dogstatsd":new StatsD("localhost", 8125, null, {"global_tags": ["gt1:1"]})});
        de.write("a", "b", {date_happened:12038123, host_name:"myhost", priority:"low", alert_type:"info", tags:["t1:1","t2:2"]});
    });

    function setMessageExpectation(message, server, done){
        server.on("message", function (msg, rinfo) {
            expect(msg.toString()).to.equal(message);
            done();
        });
    }
});
