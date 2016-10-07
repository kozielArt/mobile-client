/**
 * Created by ArturK on 2015-10-06.
 */
angular.module('app.modules.account.remove', [
  'commons.models.account',
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account.remove', {
      url: '/remove',
      views: {
        'content@app': {
          controller: 'RemoveCtrl as removeCtrl',
          templateUrl: 'js/app/modules/account/remove/remove.tmpl.html'
        }
      }
    });
  })
  .controller('RemoveCtrl', function ($stateParams, $rootScope, $ionicPopup, $scope, ModulesModel, AccountModel, UserModel) {
    var removeCtrl = this;


    removeCtrl.form = {
      emailAddress: '',
      password: ''
    }

    cancel = function () {
      ModulesModel.open('account');
    }

    removeAccount = function () {
      UserModel.getUser().then(function (user) {
        AccountModel.removeAccount(user.emailAddress, removeCtrl.form.password).then(function (result) {

          if (removeCtrl.form.password == "") {
            ModulesModel.open('account');
          }

          else if (result === null || result === undefined) {
            $ionicPopup.alert({
              title: 'Błąd',
              content: 'Niepoprawne hasło'
            }).then(function () {
              ModulesModel.open('account');
            });
          }
          else {
            $ionicPopup.alert({
              title: 'Sukces',
              content: 'Konto usunięte. Zostaniesz przeniesiony na stronę główną.'
            }).then(function () {
              UserModel.logout();
              ModulesModel.open('main');
            });
          }
        })
      })
    }
    removeCtrl.removeAccount = removeAccount;
    removeCtrl.cancel = cancel;
  });
