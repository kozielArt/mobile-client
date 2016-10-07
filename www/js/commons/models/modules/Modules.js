/**
 * Created by Tomasz on 2015-10-01.
 */
angular.module('commons.models.modules', [])
  .service('ModulesModel', function ($state, $rootScope) {
    var service = this;
    var modules = [
      {name: 'user', defaultState: 'app.user', active: false, lastState: {name: undefined, params: {}}},
      {name: 'account', defaultState: 'app.account', active: false, lastState: {name: undefined, params: {}}},
      {name: 'ticket', defaultState: 'app.ticket', active: true, lastState: {name: undefined, params: {}}},
      {name: 'history', defaultState: 'app.history', active: false, lastState: {name: undefined, params: {}}},
      {name: 'reminders', defaultState: 'app.reminders', active: false, lastState: {name: undefined, params: {}}},
      {name: 'main', defaultState: 'app.main', active: true, lastState: {name: undefined, params: {}}},
      {name: 'logout', defaultState: 'app.logout', active: false, lastState: {name: undefined, params: {}}}
    ];
    $rootScope.$on("user.login", function (event) {
      var modulesToActivate = ["account", "history", "user", "reminders", "logout"];
      for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if (modulesToActivate.indexOf(module.name) !== -1) {
          module.active = true;
        }
      }
    });
    $rootScope.$on("user.logout", function (event) {
      var modulesToDeactivate = ["account", "history", "user", "reminders", "logout"];
      for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if (modulesToDeactivate.indexOf(module.name) !== -1) {
          module.active = false;
        }
      }
    });

    function open(moduleName, advice) {
      modules.forEach(function (module) {
        if (module.name == moduleName) {
          var state = module.defaultState;
          var params = {};
          if (advice !== undefined) {
            if (advice.state !== undefined) {
              state += "." + advice.state;
            }
            if (advice.params != undefined) {
              params = advice.params;
            }
          }
          if (advice === undefined || (advice !== undefined && advice.force !== true)) {
            if (module.lastState.name !== undefined) {
              state = module.lastState.name;
              params = module.lastState.params;
            }
          }
          $state.go(state, {reload: true});
        }
      })
    }

    function isModulActive(moduleName) {
      for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if (module.name == moduleName) {
          return module.active;
        }
      }
      return false;
    }


    service.open = open;
    service.isModulActive = isModulActive
  });
