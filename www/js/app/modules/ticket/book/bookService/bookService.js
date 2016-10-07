/**
 * Created by ArturK on 2015-10-19.
 */
angular.module('app.modules.ticket.book.bookService', [
  'commons.models.system.branches',
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book.bookService', {
      url: '/bookService',
      views: {
        'bookAppointmentForm': {
          controller: 'BookServiceCtrl as bookServiceCtrl',
          templateUrl: 'js/app/modules/ticket/book/bookService/bookService.tmpl.html'
        }
      }
    });
  })
  .controller('BookServiceCtrl', function ($stateParams, BookingsModel) {
    var bookServiceCtrl = this;
    bookServiceCtrl.services = {};
    bookServiceCtrl.selectedBranch= {};

    BookingsModel.getSelectedBranch().then(function(selectedBranch){
      bookServiceCtrl.selectedBranch = selectedBranch;
      BookingsModel.getBranchProducts(selectedBranch.id).then(function (services) {
        bookServiceCtrl.services = services;
      })
    });

    selectService = function (product) {
      BookingsModel.getBranchProductDates(bookServiceCtrl.selectedBranch.id, product.id);
    }

    bookServiceCtrl.selectService = selectService;
  });
