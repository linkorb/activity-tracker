(function (w, d) {
    var t = {
      sender: 'websocket',
      debug: false,
      serverUri: null,
      conf: {},
      stack: [],
      agent: {},
      lastPushStamp: 0,
      lastPushIndex: 0,
      reportInterval: 5000,
      handle: null,
      log: function (data) {
        if (this.debug) console.log(data)
      },
      showStack: function() {
        this.log(this.stack)
      },
      getStackMeta: function() {
        let m = this.conf;
        m.uri = w.location.href;
        return m;
      },
      getStackLast: function() {
        return this.stack[this.stack.length - 1];
      },
      provision: function() {
        this.configure();
        this.stack.push({
          stamp: this.getStamp(),
          event: 'provision',
          meta: this.getStackMeta(),
          agent: this.agent
        });
        this.log('_at provisioned')
      },
      configure: function () {
        if (this.conf.sender) {
            this.sender = this.conf.sender;
        }
        if (this.conf.serverUri) {
            this.serverUri = this.conf.serverUri;
        }
        if (this.conf.debug) {
          this.debug = !!this.conf.debug;
        }
        if (this.conf.reportInterval) {
          this.reportInterval = parseInt(this.conf.reportInterval);
        }
        this.log(this.conf)
      },
      init: function () {
        this.initAgent();
        this.provision();
        this.connect();
        this.exposeUtil();
        ['mousemove', 'click', 'dblclick', 'keyup', 'scroll'].forEach(t.listenEvent);
        this.log('_at initialized');
      },
      initAgent: function() {
        if (typeof w.platform === 'undefined') {
          return false;
        }
        this.agent = {
          ua: w.platform.ua,
          name: w.platform.name,
          version: w.platform.version,
          product: w.platform.product,
          manufacturer: w.platform.manufacturer,
          os: w.platform.os,
          layout: w.platform.layout,
          locale: navigator.language,
        };
      },
      connect: function() {
        if (!this.serverUri) {
          this.log('serverUri not configured!');
          return false;
        }
        if (this.handle) {
          return this.handle;
        }
        if (this.sender == 'websocket') {
          try {
            this.handle = new WebSocket(this.serverUri);
            this.handle.onopen = function() {
              t.send()
            }
          } catch (err) {
            this.log('failed to connect to server')
          }
        }
      },
      listenEvent: function(name) {
        d.addEventListener(name, t.record);
      },
      record: function(event) {
        let d = {
          stamp: t.getStamp(),
          event: event.type,
          meta: t.getStackMeta(),
          properties: {}
        };
        switch (event.type) {
          case 'scroll':
            if ((d.stamp - t.getStackLast().stamp) < 500) {
              return;
            }
            d.properties.pageYOffset = w.pageYOffset;
            d.properties.pageXOffset = w.pageXOffset;
            break;
          case 'mousemove':
            if ((d.stamp - t.getStackLast().stamp) < 1000) {
              return;
            }
            d.properties.cursorX = event.pageX;
            d.properties.cursorY = event.pageY;
            break;
          case 'keyup':
            d.properties.keyCode = event.keyCode;
            break;
          case 'click':
            d.properties.cursorX = event.pageX;
            d.properties.cursorY = event.pageY;
            break;
          case 'dblclick':
            d.properties.cursorX = event.pageX;
            d.properties.cursorY = event.pageY;
            break;
          default:
            break;
        }
        t.stack.push(d)
      },
      send: function (inclAgent) {
        if (this.handle) {
          let payload = [];
          for (var i = this.lastPushIndex; i < this.stack.length; i++) {
            payload.push(this.stack[i])
          }
          this.lastPushIndex = i;
          if (this.handle && this.handle.readyState === 1) {
            this.handle.send(JSON.stringify(payload));
            w.setTimeout(function(){
              t.send()
            }, this.reportInterval);
          } else {
            this.log('websocket not ready')
          }
        }
      },
      getStamp: function () {
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        return Date.now()
      },
      exposeUtil: function() {
        // expose method to show stack info
        if (this.debug) {
          w.atStack = t.showStack.bind(t);
          // it's recommended not to expose the lib
          // w._at = t;
        }
      }
    }

    // Expose provision method so that provising can be invoked after changing config
    w.atProvision = t.provision.bind(t);

    // Expose the configurator as a function
    // e.g. at('debug'), at('contentId', 6)
    w.at = function() {
      let args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
      if (!args[0]) return false;
      t.conf[args[0]] = args[1] || true;
    };
    
    d.addEventListener('DOMContentLoaded', t.init.bind(t));
})(window, document);
