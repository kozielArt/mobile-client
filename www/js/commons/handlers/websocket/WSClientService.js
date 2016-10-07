/**
 * Created by Tomasz on 2015-10-30.
 */
angular.module('commons.handlers.websocket.client', [])
  .service('WSClientService', function ($http, $q, $rootScope, $window) {

    var service = this;
    var address = 'ws://'+ endpointAddress+'/ws/client/';
    var currentConnection;
    var operationHandlers = new Array();
    var lifecycleHandlers = new Array();

    function onMessage(messageEvent) {
      var message = angular.fromJson(messageEvent.data);
      if (message.operation) {
        var data = angular.fromJson(message.data);
        var isHandlerFound = false;
        _.forEach(operationHandlers, function (handler) {
          if (!isHandlerFound && handler.operation === message.operation) {
            handler.callback(message.operation, data);
            isHandlerFound = true;
          }
        })
        if (!isHandlerFound) {
          console.error("No Handler found for operation ", message.operation)
        }
      } else {
        console.error("Unknown message format - no Operation is set")
      }
    }

    function onError(error) {
      console.log("WSClientService onError", error)
    }

    function onOpen() {
      console.log("WSClientService onOpen")
    }

    function onClose() {
      console.log("WSClientService onClose")
      currentConnection = undefined
    }

    function disconnect() {
      console.log("WSClientService disconnecting")
      if (currentConnection)
        currentConnection.close();
    }

    function connect() {
      console.log("WSClientService: Connecting to ", address);
      currentConnection = new WebSocket(address);
      currentConnection.handler = service;

      currentConnection.onopen = function (data, data2, data3) {
        onOpen(data, data2, data3);
        executeLifecycleCallbacks('onOpen', data);
      };
      currentConnection.onmessage = function (message, flags) {
        onMessage(message, flags);
      };
      currentConnection.onclose = function (data, data2, data3) {
        onClose(data, data2, data3);
        executeLifecycleCallbacks('onClose', data);
        currentConnection = undefined
        operationHandlers = new Array();
        lifecycleHandlers = new Array();
      };
      currentConnection.onerror = function (data, data2, data3) {
        onError(data, data2, data3);
        executeLifecycleCallbacks('onError', data);
      };
    }

    function executeLifecycleCallbacks(event, data) {
      if (lifecycleHandlers && lifecycleHandlers.length > 0) {
        _.forEach(lifecycleHandlers, function (handler) {
          if (handler.event === event)
            handler.callback(data);
        })
      }
    }

    function sendEvent(operation, data) {
      if (isConnected()) {
        currentConnection.send(angular.toJson({operation: operation, data: data}))
      }
    }

    function isConnected() {
      return currentConnection ? true : false;
    }

    function registerOperationHandler(operation, callback) {
      operationHandlers.push({operation: operation, callback: callback});
    }

    function registerLifecycleHandler(event, callback) {
      lifecycleHandlers.push({event: event, callback: callback});
    }

    service.connect = connect;
    service.disconnect = disconnect;
    service.isConnected = isConnected;
    service.sendEvent = sendEvent;
    service.registerOperationHandler = registerOperationHandler;
    service.registerLifecycleHandler = registerLifecycleHandler
  });
