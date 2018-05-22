activity-tracker
========

activity-tracker.js is a simple way to track browser side user behavior. It is helpful for analyzing users' behavior when reading your web articles. 

## Installation
```
npm install @linkorb/activity-tracker
```
To build activity-tracker into your lib with webpack:
```
require('@linkorb/activity-tracker');
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

    // server address to report to - websocket
    // at('sender', 'websocket'); // optional, the default sender is websocket
    at('serverUri', 'ws://127.0.0.1:7777')

    // server address to report to - ajax
    at('sender', 'xmlhttp')
    at('serverUri', 'http://localhost/myWebserver')
    
    // time interval to report to the server, in ms. default 5000
    at('reportInterval', 6000) 

    // custom/meta variables
    at('meta', 'meRock')
    at('meta', 'contentId', 6)
    at('meta', 'userGroup', 'Cool people')
    at('meta', 'requestId', 'aa-bb-cc-dd-eee')
</script>
```

## Re-provision
When new content/page is loaded without page reload, e.g. AJAX, you can re-provision the activity-tracker:
```html
<script>
at('contentId', 7);
at('requestId', 'ff-gg-hh-ii-jjj');
atProvision();
</script>
```

## Subscribe only to certain events
By default, activity-tracker reports the following events: __mousemove__, __click__, __dblclick__, __keyup__, __scroll__. You can specify only certain events are reported:
```javascript
// only report click and scroll events
at('subscribe', 'click, scroll');
atProvision();
```

## Inspect local activity stack
```html
<script>
// list all the activity objects recorded
atStack()
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
