angular.module('app.modules.account.editAccount', [
  'commons.models.account',
  'app.modules.account.editAccount'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account.editAccount', {
      url: '/editAccount',
      views: {
        'content@app': {
          controller: 'EditAccountCtrl as editAccountCtrl',
          templateUrl: 'js/app/modules/account/editAccount/editAccount.tmpl.html'
        }
      }
    });
  })
  .controller('EditAccountCtrl', function ($stateParams, $rootScope, $ionicPopup, $scope, ModulesModel, AccountModel, UserModel) {
    var editAccountCtrl = this;

    editAccountCtrl.form = {
      emailAddress: '',
      firstName: '',
      lastName: ''
    }

    $scope.$on('$ionicView.enter', function () {
      UserModel.getUser().then(function (user) {
        editAccountCtrl.form = user
      })
    })

    changeAccountData = function () {
      AccountModel.editAccount(editAccountCtrl.form.emailAddress, editAccountCtrl.form).then(function (response) {
        console.log(response)
        if (response.status === 200) {
          $ionicPopup.alert({
            title: 'Sukces',
            content: 'Twoje kono zostało zmienione. '
          })
          ModulesModel.open('account');
        } else {
          $ionicPopup.alert({
            title: 'Błąd',
            content: 'Spróbuj ponownie.'
          })
        }
      })
    }

    cancel = function () {
      ModulesModel.open('account');
    }

    editAccountCtrl.changeAccountData = changeAccountData;
    editAccountCtrl.cancel = cancel;
  })
