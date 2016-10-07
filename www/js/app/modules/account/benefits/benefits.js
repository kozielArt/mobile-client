/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.account.benefits', [
  'commons.models.modules'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.account.benefits', {
      url: '/benefits',
      views: {
        'content@app': {
          controller: 'BenefitsCtrl as benefitsCtrl',
          templateUrl: 'js/app/modules/account/benefits/benefits.tmpl.html'
        }
      }
    })
  })
  .controller('BenefitsCtrl', function ($stateParams, $ionicHistory, ModulesModel) {
    var benefitsCtrl = this;

    function createAccountAction() {
      ModulesModel.open('account', {force: true, state: 'create'})
    }

    function thanksAction() {
      $ionicHistory.goBack();
    }

    benefitsCtrl.createAccountAction = createAccountAction;
    benefitsCtrl.thanksAction = thanksAction;
  });
