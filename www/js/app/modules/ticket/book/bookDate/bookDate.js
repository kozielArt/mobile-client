/**
 * Created by ArturK on 2015-10-21.
 */
angular.module('app.modules.ticket.book.bookDate', [
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book.bookDate', {
      url: '/bookDate',
      views: {
        'bookAppointmentForm': {
          controller: 'BookDateCtrl as bookDateCtrl',
          templateUrl: 'js/app/modules/ticket/book/bookDate/bookDate.tmpl.html'
        }
      }
    });
  })
  .controller('BookDateCtrl', function ($stateParams, $scope, BookingsModel) {
    var bookDateCtrl = this;
    bookDateCtrl.dates = {};
    bookDateCtrl.hours = {};
    bookDateCtrl.product = {};
    bookDateCtrl.branch = {};
    bookDateCtrl.selectedDay = {};


    BookingsModel.getSelectedBranch().then(function(branch){
      bookDateCtrl.branch = branch;
      BookingsModel.getSelectedProduct().then(function(product){
        bookDateCtrl.product = product;
        BookingsModel.getBranchProductDates(bookDateCtrl.branch.id, bookDateCtrl.product.id).then(function(dates){
          bookDateCtrl.dates = dates;
        })
      })
    })

    selectDay = function (day) {
      BookingsModel.getBranchProductDateHours(bookDateCtrl.branch.id, bookDateCtrl.product.id, day.date)

    }
    bookDateCtrl.selectDay = selectDay;
  });
