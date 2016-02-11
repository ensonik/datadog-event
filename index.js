'use strict';

var DD = require("node-dogstatsd").StatsD;

class DatadogEvent {

    constructor(options) {
        this.datadog = options.dogstatsd;
    }

    write(title, text, tags) {
        let merged_tags = [];

        if (this.datadog.global_tags || tags) {
            if (Array.isArray(this.datadog.global_tags)) {
                merged_tags = merged_tags.concat(this.datadog.global_tags);
            }

            if (Array.isArray(tags)) {
                merged_tags = merged_tags.concat(tags);
            }
        }

        let data = "_e{" + title.length +","+text.length+"}:"+title+"|"+text+"|#" + merged_tags;
        this.datadog.send_data(new Buffer(data));
    }
};

module.exports = DatadogEvent;



