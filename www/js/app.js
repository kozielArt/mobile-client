// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var backButtonClicked = false;
var endpointAddress = '83.144.89.186:8443';
var username = "mobile"
var password = "ulan";
angular.module('app', ['ionic', 'app.menu'])

  .run(function ($ionicPlatform, $timeout, TicketsStore) {
    $ionicPlatform.ready(function () {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $ionicPlatform.registerBackButtonAction(function (event) {
        TicketsStore.getStoredTicket().then(
          function (ticket) {
            window.plugins.toast.showShortBottom('Nie da rady - masz aktywny bilet');
          }, function () {
            if (backButtonClicked == false) {
              backButtonClicked = true;
              window.plugins.toast.showShortBottom('Naciśnij ponownie aby opuścić aplikację');
              $timeout(function () {
                backButtonClicked = false;
              }, 2000);
            } else {
              navigator.app.exitApp();
            }
          }
        );
      }, 100);
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    if (!ionic.Platform.isIOS()) {
      $ionicConfigProvider.scrolling.jsScrolling(false);
    }
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'js/app/menu/menu.tmpl.html',
        controller: 'MenuCtrl as menuCtrl'
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');

    function encodeBase64(input) {
      var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var output = '';
      var chr1, chr2, chr3 = '';
      var enc1, enc2, enc3, enc4 = '';
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
      } while (i < input.length);

      return output;
    }

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + encodeBase64(username + ':' + password);
  });
