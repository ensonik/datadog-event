'use strict';

const DD = require("node-dogstatsd").StatsD;
const _ = require("lodash");

class DatadogEvent {

    constructor(options) {
        options = options || {};
        this.datadog = options.dogstatsd || new DD();
    }

    write(title, text, options, callback) {
        if (_.isEmpty(title) || _.isEmpty(text)) {
            let error = new Error("The title and text are mandatory");
            return callback ? callback(error) : error;
        }

        options = options || {};

        let merged_tags = _.union(this.datadog.global_tags, options.tags);
        let date_happened = this.extractDateHappened(options.date_happened);

        let data = _.template('_e{${titleLength},${textLength}}:${title}|${text}${date}${host}${priority}${alertType}${tags}')({
            "titleLength":  title.length,
            "textLength":   text.length,
            "title":        title,
            "text":         text,
            "date":         date_happened ? "|d:" + date_happened : "",
            "host":         options.host_name ? "|h:" + options.host_name : "",
            "priority":     options.priority ? "|p:" + options.priority : "",
            "alertType":    options.alert_type ? "|t:" + options.alert_type : "",
            "tags":         merged_tags.length > 0 ? "|#" + merged_tags : ""
        });

        this.datadog.send_data(new Buffer(data));
    }

    extractDateHappened(date) {
        return isNaN(date) ? undefined : date;
    }
};

module.exports = DatadogEvent;



