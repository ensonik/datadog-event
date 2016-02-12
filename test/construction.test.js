'use strict';

const expect = require('chai').expect;
const StatsD = require('node-dogstatsd').StatsD;
const DatadogEvent = require("../index");

describe('The module construction', function () {

    it('should initalize an empty dogstatsd object if none is passed in', function() {
        var de = new DatadogEvent();
        expect(de.datadog.host).to.equal("localhost");
        expect(de.datadog.port).to.equal(8125);
    });

    it('should not fail if there is no callback specified', function() {
        (new DatadogEvent()).write("", "Text");
    });

    it('should return an error in callback when empty title', function(done) {
        (new DatadogEvent()).write("", "Text", {}, function(err, data) {
            expect(err.message).to.equal("The title and text are mandatory");
            done();
        });
    });

    it('should return an error in callback when null title', function(done) {
        (new DatadogEvent()).write(null, "Text", {}, function(err, data) {
            expect(err.message).to.equal("The title and text are mandatory");
            done();
        });
    });

    it('should return an error in callback when empty text', function(done) {
        (new DatadogEvent()).write("Title", "", {}, function(err, data) {
            expect(err.message).to.equal("The title and text are mandatory");
            done();
        });
    });

    it('should return an error in callback when null text', function(done) {
        (new DatadogEvent()).write("Title", null, {}, function(err, data) {
            expect(err.message).to.equal("The title and text are mandatory");
            done();
        });
    });
});
