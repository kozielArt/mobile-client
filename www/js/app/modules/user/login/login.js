/**
 * Created by Tomasz on 2015-10-01.
 */
angular.module('app.modules.user.login', [
  'commons.models.user'
])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.user.login', {
        url: '/login',
        views: {
          'content@app': {
            controller: 'LoginCtrl as loginCtrl',
            templateUrl: 'js/app/modules/user/login/login.tmpl.html'
          }
        }
      })
  })
  .controller('LoginCtrl', function ($stateParams, UserModel, ModulesModel, $ionicPopup, $scope) {
    var userCtrl = this;
    userCtrl.username = "";
    userCtrl.password = "";
    userCtrl.rememberMe = true;

    function loginAction() {
      UserModel.login(userCtrl.username, userCtrl.password, userCtrl.rememberMe).then(function (logged) {
          if(logged === false) {
            $ionicPopup.alert({
              title: 'Błąd',
              content: 'Niepoprawna nazwa użytkownika lub hasło.'
            })
          }else {
            ModulesModel.open('account');
          }
        });
    }
    userCtrl.loginAction = loginAction;
  });
