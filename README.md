[![NPM](https://nodei.co/npm/datadog-event.png)](https://npmjs.org/package/datadog-event)

Writes an event to Datadog through the node-dogstatsd library. 

# Importing

     "datadog-event": "1.2.1"


# Usage
    
     const DD = require("node-dogstatsd").StatsD;
     const DatadogEvent = require('datadog-event')
     
     ...
     let datadogEvent = new DatadogEvent({ "dogstatsd":new DD() });
     datadogEvent.write("My Title", "My Description", { tags:["mytags"] });     

When creating a new `datadog-event` you can pass in your own dogstatsd object or let the module create a default one (localhost:8125). 

Options available on the write:
* date_happened (numeric)
* host_name
* priority
* alert_type
* tags

(see tests)


### write()

The write method acceps 4 parameters

```
datadogEvent.write(title, text, options, callback);
```

The callback is used when there is a data input validation error and is optional. For example:

```
datadogEvent.write(null, "My Text", {tags:["a:b"], function(err) {
    if (err) {
        console.error(err.message);
    }
});

// Outputs an error because the title is null
```


# Tags

Global tags specified in the dogstatsd object will be merged with the tags passed into the write function.


# Internals

A Datadog event looks like this: 

_e{title.length,text.length}:title|text|d:date_happened|h:hostname|p:priority|t:alert_type|#tag1,tag2

Where the title and text are mandatory and the other information is optional.