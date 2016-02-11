'use strict';

var DD = require("node-dogstatsd").StatsD;

class DatadogEvent {

    constructor(options) {
        this.datadog = options.dogstatsd;
    }

    write(title, text, options) {
        options = options || {};

        let merged_tags = this.mergeTags(this.datadog.global_tags, options.tags);
        let data = `_e{${title.length},${text.length}}:${title}|${text}|#${merged_tags}`

        this.datadog.send_data(new Buffer(data));
    }

    mergeTags(t1, t2) {
        let merged_tags = [];

        if (t1 && Array.isArray(t1)) {
            merged_tags = merged_tags.concat(t1);
        }

        if (t2 && Array.isArray(t2)) {
            merged_tags = merged_tags.concat(t2);
        }

        return merged_tags;
    }
};

module.exports = DatadogEvent;



