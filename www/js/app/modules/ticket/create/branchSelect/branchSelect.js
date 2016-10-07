/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('app.modules.ticket.create.branchSelect', [
  'commons.models.system.branches',
  'app.modules.ticket.create.branchSelect'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.create.branchSelect', {
      url: '/branchSelect',
      views: {
        'ticketCreateForm': {
          controller: 'BranchSelectCtrl as branchSelectCtrl',
          templateUrl: 'js/app/modules/ticket/create/branchSelect/branchSelect.tmpl.html'
        }
      }
    });
  })

  .controller('BranchSelectCtrl', function ($stateParams, $scope, BranchesModel, TicketsCreateService) {
    var branchSelectCtrl = this;
    branchSelectCtrl.branches = [];
    branchSelectCtrl.loading = true;
    branchSelectCtrl.noBranchesAvailable = false;

    BranchesModel.getBranches().then(function (branches) {
      var tmpBranches = [];
      _.forEach(branches, function(branch){
        if (branch.currentlyOpen){
          tmpBranches.push(branch);
        }
      })

      if (tmpBranches && tmpBranches.length > 0) {
        branchSelectCtrl.noBranchesAvailable = false;
      }else{
        branchSelectCtrl.noBranchesAvailable = true;
      }
      branchSelectCtrl.branches = tmpBranches;
      branchSelectCtrl.loading = false;
    });

    function selectBranch(branch) {
      TicketsCreateService.selectBranch(branch._id);
    }

    branchSelectCtrl.selectBranch = selectBranch;
  });
