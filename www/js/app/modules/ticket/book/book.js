/**
 * Created by ArturK on 2015-10-20.
 */
angular.module('app.modules.ticket.book', [
  'commons.models.system.bookings',
  'app.modules.ticket.book.bookBranch',
  'app.modules.ticket.book.bookService',
  'app.modules.ticket.book.bookDate',
  'app.modules.ticket.book.bookHour',
  'app.modules.ticket.book.makeReservation'

])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book', {
      url: '/bookAppointment',
      views: {
        'content@app': {
          controller: 'BookAppointmentCtrl as bookAppointmentCtrl',
          templateUrl: 'js/app/modules/ticket/book/book.tmpl.html'
        }
      }
    });
  })
  .controller('BookAppointmentCtrl', function ($scope, $stateParams, ModulesModel, BookingsModel) {
    var bookAppointmentCtrl = this;
    bookAppointmentCtrl.selectedBranch;
    bookAppointmentCtrl.selectedService;
    bookAppointmentCtrl.selectedDate;
    bookAppointmentCtrl.reservation;

    $scope.$on('$ionicView.enter', function () {
      BookingsModel.getSelectedBranch().then(
        function (selectedBranch) {
          bookAppointmentCtrl.selectedBranch = selectedBranch;
          BookingsModel.getSelectedProduct().then(
            function (selectedService) {
              bookAppointmentCtrl.selectedService = selectedService;
            },
            BookingsModel.getBranchProductDates().then(
              function (selectedDate) {
                bookAppointmentCtrl.selectedDate = selectedDate;
              },
              BookingsModel.getBranchProductDateHours().then(
                function (selectedHour) {
                  bookAppointmentCtrl.selectedHour = selectedHour;
                },
                function (noHourError) {
                  ModulesModel.open('ticket', {force: true, state: 'book.bookHour'});
                }
              ),
              BookingsModel.makeReservation().then(
                function (reservation) {
                  bookAppointmentCtrl.reservation = reservation;
                },
                function (noHourError) {
                  ModulesModel.open('ticket', {force: true, state: 'book.makeReservation'});
                }
              ),
              function (noDateError) {
                ModulesModel.open('ticket', {force: true, state: 'book.bookDate'});
              }
            ),
            function (noServiceError) {
              ModulesModel.open('ticket', {force: true, state: 'book.bookService'});
            }
          )
        },
        function (noBranchError) {
          ModulesModel.open('ticket', {force: true, state: 'book.bookBranch'});
        }
      )
    });

    $scope.$on('ticket.book.serviceSelected', function (event, selectedBranch) {
      bookAppointmentCtrl.selectedBranch = selectedBranch
      ModulesModel.open('ticket', {force: true, state: 'book.bookService'})
    });

    $scope.$on('ticket.book.dateSelected', function (event, selectedService) {
      bookAppointmentCtrl.selectedService = selectedService
      ModulesModel.open('ticket', {force: true, state: 'book.bookDate'})
    });

    $scope.$on('ticket.book.hourSelected', function (event, selectedHour) {
      bookAppointmentCtrl.selectedHour = selectedHour
      ModulesModel.open('ticket', {force: true, state: 'book.bookHour'})
    });

    $scope.$on('ticket.book.reservationMade', function (event, selectedDate) {
      bookAppointmentCtrl.selectedDate = selectedDate
      ModulesModel.open('ticket', {force: true, state: 'book.makeReservation'})
    });

    $scope.$on('ticket.book.branchCleared', function () {
      bookAppointmentCtrl.selectedBranch = undefined;
      ModulesModel.open('ticket', {force: true, state: 'book.bookBranch'})
    })

    function clearBranch() {
      BookingsModel.clearBranch();
    }

    function cancel() {
      BookingsModel.clearBranch();
      ModulesModel.open('ticket');
    }

    bookAppointmentCtrl.clearBranch = clearBranch;
    bookAppointmentCtrl.cancel = cancel;
  });
