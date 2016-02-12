Writes an event to Datadog through the node-dogstatsd library. 

# Importing

     "datadog-event": "0.0.0"


# Using in code
    
     var DD = require("node-dogstatsd").StatsD;
     ...
     
     var DatadogEvent = require('datadog-event')( {"dogstatsd":new DD("localhost",8125)} );
     ...
     DatadogEvent.write("My Title","My Description", {tags:["mytags"]});

When creating a new `datadog-event` you can pass in your own dogstatsd object or let the module create a default one (localhost:8125). 

Options available on the write object include:

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

The callback is used only in case of an error with the data passed in and is optional. For example:

```
datadogEvent.write("My Title", "My Text", {tags:["a:b"], function(err) {
    if (err) {
        console.error(err.message);
    }
});
```


# Tags

Global tags specified in the dogstatsd object will be merged with the tags passed into the write function.


# Internals

A Datadog event looks like this: 

_e{title.length,text.length}:title|text|d:date_happened|h:hostname|p:priority|t:alert_type|#tag1,tag2

Where the title and text are mandatory and the other information is optional.