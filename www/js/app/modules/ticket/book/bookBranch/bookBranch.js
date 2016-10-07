angular.module('app.modules.ticket.book.bookBranch', [
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book.bookBranch', {
      url: '/bookBranch',
      views: {
        'bookAppointmentForm': {
          controller: 'BookBranchCtrl as bookBranchCtrl',
          templateUrl: 'js/app/modules/ticket/book/bookBranch/bookBranch.tmpl.html'
        }
      }
    });
  })
  .controller('BookBranchCtrl', function ($stateParams, $scope, BookingsModel) {
    var bookBranchCtrl = this;
    bookBranchCtrl.branches = {};

    BookingsModel.getBranches().then(function (branches) {
      bookBranchCtrl.branches = branches;
    });

    selectBranch = function (branch) {
      BookingsModel.getBranchProducts(branch.id);
    }

    bookBranchCtrl.selectBranch = selectBranch;
  });


