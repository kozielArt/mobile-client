/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.user', [
  'app.modules.user.login',
  'commons.models.user'

])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.user', {
        url: '/user',
        views: {
          'content': {
            controller: 'UserCtrl as userCtrl',
            templateUrl: 'js/app/modules/user/user.tmpl.html'
          }
        }
      })

  })
  .controller('UserCtrl', function ($stateParams, UserModel, $scope) {

    var userCtrl = this;
    userCtrl.user = {};

    $scope.$on('$ionicView.enter', function () {
      UserModel.getUser().then(function (user) {
        userCtrl.user = user;
      });
    })
  });
