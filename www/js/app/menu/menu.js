/**
 * Created by Tomasz on 2015-10-01.
 */
angular.module('app.menu', [
  'commons.handlers.app.ticket',
  'commons.models.device.notifications',
  'app.modules.account',
  'app.modules.user',
  'app.modules.history',
  'app.modules.reminders',
  'app.modules.main',
  'app.modules.ticket',
  'commons.models.modules',
  'commons.models.user'
])
  .controller('MenuCtrl', function ($stateParams, $state, $scope, $rootScope, $cordovaLocalNotification, $ionicPopup, ModulesModel, UserModel, CurrentTicketService,NotificationsService) {

    var menuCtrl = this;
    menuCtrl.user = {};
    CurrentTicketService.init();

    $scope.$on('$ionicView.enter', function () {
      UserModel.getUser().then(function (user) {
        menuCtrl.user = user;
      });
    })


    $scope.$on("user.login", function () {
      UserModel.getUser().then(function (user) {
        menuCtrl.user = user;
      })
    });

    $scope.$on("user.logout", function () {
      menuCtrl.user = {};
    });

    function displayModule(moduleName, params) {
      ModulesModel.open(moduleName, params);
    }

    function isModulActive(moduleName) {
      return ModulesModel.isModulActive(moduleName);
    }

    function logoutAction() {
      UserModel.logout();
      ModulesModel.open('user', {state: 'login'})
    }

    /*
    document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork()

      var isOnline = $cordovaNetwork.isOnline()

      var isOffline = $cordovaNetwork.isOffline()


       // listen for Online event
       $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
       var onlineState = networkState;
       if(networkState == true){

       }
       else {
       var confirmPopup = $ionicPopup.alert({
       title: 'Network',
       template: 'Połączono z internetem.'
       });
       confirmPopup.then(function (res) {
       })
       }
       })

       // listen for Offline event
       $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
       var offlineState = networkState;

       var confirmPopup = $ionicPopup.alert({
       title: 'Network',
       template: 'Brak połączenia z internetem. <br> Sprawdź ustawienia sieci.'
       });
       confirmPopup.then(function (res) {
       })
       })

       }, false);

    }
       */
    menuCtrl.isModulActive = isModulActive;
    menuCtrl.displayModule = displayModule;
    menuCtrl.logoutAction = logoutAction;
  });
