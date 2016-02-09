'use strict';

var DD = require("node-dogstatsd").StatsD;

function DatadogEvent(options) {
    var datadog = options.dogstatsd;
    return {
        write: function(title, text, tags) {
            let data = "_e{" + title.length +","+text.length+"}:"+title+"|"+text+"|#" + tags;
            datadog.send_data(new Buffer(data));
        }
    }
};

module.exports = DatadogEvent;



