/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.account', [
  'app.modules.account.benefits',
  'app.modules.account.create',
  'app.modules.account.remove',
  'app.modules.account.edit',
  'app.modules.account.editAccount'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account', {
      url: '/account',
      views: {
        'content': {
          controller: 'AccountCtrl as accountCtrl',
          templateUrl: 'js/app/modules/account/account.tmpl.html'
        }
      }
    });
  })
  .controller('AccountCtrl', function ($stateParams, $scope, AccountModel, UserModel, ModulesModel) {
    var accountCtrl = this;
    accountCtrl.form = {
      emailAddress: '',
      firstName: '',
      lastName: '',
      properties:'',
      created: ''
    }

    function editAccountAction() {
      ModulesModel.open('account',{force: true, state: 'editAccount'})
    }


    function removeAccountAction() {
      ModulesModel.open('account',{force: true, state: 'remove'})
    }

    function editPasswordAction(){
      ModulesModel.open('account',{force: true, state: 'edit'})
    }

    $scope.$on('$ionicView.enter', function () {
      UserModel.getUser().then(function (user) {
        AccountModel.getAccount(user.emailAddress).then(function (result) {
          accountCtrl.form = result;
        })
    });
    });

    accountCtrl.removeAccountAction = removeAccountAction;
    accountCtrl.editPasswordAction = editPasswordAction;
    accountCtrl.editAccountAction = editAccountAction;
  });
