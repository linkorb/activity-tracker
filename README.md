activity-tracker
========

activity-tracker.js is a simple way to track browser side user behavior. It is helpful for analyzing users' behavior when reading your web articles. 

## Installation
```
npm install @linkorb/activity-tracker
```

## Demo

Check the `demo/` directory for an demonstration + example on how to use activity-tracker. To run the demo for test:
```
php -S 127.0.0.1:8888
```
Then you can access the demo from: __http://localhost:8888/demo__

It is possible to configure the activity-tracker:
```html
<!-- platform.js is used for reporting the agent info. optional -->
<script src="node_modules/platform/platform.js"></script>
<!-- load activity-tracker -->
<script src="dist/at.min.js"></script>
<!-- configuread activity-tracker -->
<script>
    // turn on debug mode
    at('debug')
    // server address to report to
    at('serverUri', 'ws://127.0.0.1:7777')
    // time interval to report to the server, in ms. default 5000
    at('reportInterval', 6000) 
    // custom variables
    at('contentId', 6)
    at('userGroup', 'Cool people')
    at('requestId', 'aa-bb-cc-dd-eee')
</script>
```

## Build from source
To change the source file and build, simply use `webpack`.
```
# generates dist/at.js
webpack -d
# generates dist/at.min.js
webpack -p
```
