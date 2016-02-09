Writes an event to Datadog. Uses the dogstatd library to write. 

# Using in code
    
     var DD = require("node-dogstatsd").StatsD;
     ...
     
     var DatadogEvent = require('datadog-event')( {"dogstatsd":new DD("localhost",8125)} );
     ...
     DatadogEvent.write("My Title","My Description","mytags");
     


# Importing as a dependency

     "datadog-event": "https://github.com/worximity/datadog-event.git#v1.0.1"


# Before you start

* The event will NOT write any global tags passed as a parameter to the ```dogstatsd``` option.

# Building and publishing a new version

When you're ready to publish a new version of the module, make sure everything is added and commited, then:
 
     git tag v0.0.0 # Where 0.0.0 is replaced by the tag version you want to mark
     git push origin --tags
     



