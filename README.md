Writes an event to Datadog. Uses the dogstatd library to write. 

# Using in code
    
     var DD = require("node-dogstatsd").StatsD;
     ...
     
     var DatadogEvent = require('datadog-event')( {"dogstatsd":new DD("localhost",8125)} );
     ...
     DatadogEvent.write("My Title","My Description", {tags:["mytags"]});

# Importing as a dependency

     "datadog-event": "https://github.com/worximity/datadog-event.git#v1.0.1"





