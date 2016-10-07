/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.account.create', [
  'commons.models.account'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account.create', {
      url: '/create',
      views: {
        'content@app': {
          controller: 'CreateCtrl as createCtrl',
          templateUrl: 'js/app/modules/account/create/create.tmpl.html'
        }
      }
    });
  })
  .controller('CreateCtrl', function ($stateParams, $ionicPopup, ModulesModel, AccountModel, UserModel) {
    var createCtrl = this;

    createCtrl.form = {
      emailAddress: '',
      password: '',
      firstName: '',
      lastName: ''
    }

    createAccount = function () {
      AccountModel.isEmailAvailable(createCtrl.form.emailAddress).then(function (result) {
        if (result.available === true) {
          AccountModel.createAccount(createCtrl.form.emailAddress, createCtrl.form.password, createCtrl.form.firstName, createCtrl.form.lastName, new Date()).then(function (createdAccount) {
            $ionicPopup.alert({
              title: 'Sukces',
              content: 'Witaj, ' + createdAccount.emailAddress
            }).then(function (res) {
              UserModel.login(createCtrl.form.emailAddress, createCtrl.form.password, true);
              ModulesModel.open('main')
            });
          });
        } else {
          $ionicPopup.alert({
            title: 'Błąd',
            content: 'Adres email jest już w użyciu.'
          }).then(function (res) {
          });
        }
      });
    }
    createCtrl.createAccount = createAccount;
  });
