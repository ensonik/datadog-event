'use strict';

const DD = require("node-dogstatsd").StatsD;

class DatadogEvent {

    constructor(options) {
        options = options || {};
        this.datadog = options.dogstatsd || new DD();
    }

    write(title, text, options, callback) {
        if((!title || title.length < 1 || !text || text.length < 1) && callback) {
            callback(new Error("The title and text are mandatory"));
            return;
        }

        options = options || {};

        let merged_tags = this.mergeTags(this.datadog.global_tags, options.tags);
        let date_happened = this.extractDateHappened(options.date_happened);

        let data =
            `_e{${title.length},${text.length}}:${title}|${text}` +     // Title and text
            ((date_happened) ? `|d:${date_happened}` : "") +            // Date happened
            ((options.host_name) ? `|h:${options.host_name}` : "") +    // Host name
            ((options.priority) ? `|p:${options.priority}` : "") +      // Priority
            ((options.alert_type) ? `|t:${options.alert_type}` : "" ) + // Alert type
            ((merged_tags.length > 0) ? `|#${merged_tags}` : "");       // Tags

        this.datadog.send_data(new Buffer(data));
    }

    extractDateHappened(date) {
        return isNaN(date) ? undefined : date;
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



