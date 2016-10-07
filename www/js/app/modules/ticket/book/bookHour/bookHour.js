/**
 * Created by ArturK on 2015-10-22.
 */
angular.module('app.modules.ticket.book.bookHour', [])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book.bookHour', {
      url: '/bookHour',
      views: {
        'bookAppointmentForm': {
          controller: 'BookHourCtrl as bookHourCtrl',
          templateUrl: 'js/app/modules/ticket/book/bookHour/bookHour.tmpl.html'
        }
      }
    });
  }).controller('BookHourCtrl', function ($stateParams, $scope, BookingsModel) {
    var bookHourCtrl = this;
    bookHourCtrl.hours = [];
    bookHourCtrl.branch = {};
    bookHourCtrl.product = {};
    bookHourCtrl.dates = {};

    BookingsModel.getSelectedBranch().then(function (branch) {
      bookHourCtrl.branch = branch;
      BookingsModel.getSelectedProduct().then(function (product) {
        bookHourCtrl.product = product;
        BookingsModel.getSelectedProductDate().then(function (dates) {
          bookHourCtrl.dates = dates;
          BookingsModel.getBranchProductDateHours(bookHourCtrl.branchId, bookHourCtrl.productId, bookHourCtrl.dates.date).then(function (hours) {
            bookHourCtrl.hours = hours;
          })
        })
      })
    })
    selectHour = function (hour) {
      BookingsModel.makeReservation(bookHourCtrl.branch.id, bookHourCtrl.product.id, bookHourCtrl.dates.date, hour)
        .then(function(hours){
        })
    }

    bookHourCtrl.selectHour = selectHour;
  })
