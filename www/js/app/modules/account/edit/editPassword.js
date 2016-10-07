angular.module('app.modules.account.edit', [
  'commons.models.account',
  'app.modules.account.edit'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account.edit', {
      url: '/edit',
      views: {
        'content@app': {
          controller: 'EditPasswordCtrl as editPasswordCtrl',
          templateUrl: 'js/app/modules/account/edit/editPassword.tmpl.html'
        }
      }
    });
  })
  .controller('EditPasswordCtrl', function ($stateParams, $rootScope, $ionicPopup, $scope, ModulesModel, AccountModel, UserModel) {
    var editPasswordCtrl = this;

    editPasswordCtrl.form = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmed: ''
    }

    cancel = function(){
      ModulesModel.open('account');
    }

    editPassword = function() {
      UserModel.getUser().then(function (user) {
        AccountModel.changePassword(user.emailAddress, editPasswordCtrl.form.oldPassword, editPasswordCtrl.form.newPassword, editPasswordCtrl.form.newPasswordConfirmed)
            .then(function (response) {
            if(response.staus === 200 && response.password === editPasswordCtrl.form.newPassword){
              $ionicPopup.alert({
                title: 'Sukces',
                content: 'Twoje hasło zostało zmienione. '
              }).then(function () {
                ModulesModel.open('account');
              });
            } else{
              $ionicPopup.alert({
              title: 'Błąd',
              content: 'Niepoprawne hasło.'
            }).then(function () {
                ModulesModel.open('account');
              });}
        })
      })
    }
    editPasswordCtrl.editPassword = editPassword;
    editPasswordCtrl.cancel = cancel;
  })
