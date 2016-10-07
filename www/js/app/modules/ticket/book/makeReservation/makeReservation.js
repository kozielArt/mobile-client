/**
 * Created by ArturK on 2015-10-23.
 */
angular.module('app.modules.ticket.book.makeReservation', [])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.book.makeReservation', {
      url: '/makeReservation',
      views: {
        'bookAppointmentForm': {
          controller: 'MakeReservationCtrl as makeReservationCtrl',
          templateUrl: 'js/app/modules/ticket/book/makeReservation/makeReservation.tmpl.html'
        }
      }
    });
  }).controller('MakeReservationCtrl', function ($stateParams, $ionicPopup, $cordovaLocalNotification, BookingsModel, ModulesModel, UserModel, AccountModel, AppointmentsModel) {
    var makeReservationCtrl = this;
    makeReservationCtrl.reservation = {};
    makeReservationCtrl.user = {};
    BookingsModel.getReservation().then(function (reservation) {
      makeReservationCtrl.reservation = reservation;
    })

    function bookAppointment() {
      makeReservationCtrl.reservation.idententificationType = "PHONE";

      BookingsModel.bookAppointment(angular.copy(makeReservationCtrl.reservation)).then(function (createdAppointment) {
        UserModel.getUser().then(function (user) {
          makeReservationCtrl.user = user;
          AccountModel.getAccount(makeReservationCtrl.user.emailAddress).then(function (account) {
            makeReservationCtrl.user.account = account;
            AppointmentsModel.save(createdAppointment, makeReservationCtrl.user.account._id).then(function (savedAppointment) {
              var date = new Date(savedAppointment.appointment.startDateTime);
              var newDate = new Date(date)
              newDate.setMinutes(date.getMinutes() - 120)
              try{
                $cordovaLocalNotification.schedule({
                  id: savedAppointment.appointment.origId,
                  at: newDate,
                  text: "Wizyta za 2 godziny",
                  title: "Przypomnienie o wizycie",
                  ongoing: false,
                  sound: 'android.resource://raw/beep-07'
                }).then(function () {
                  console.log("Appoitment notification has been scheduled");
                  BookingsModel.clearBranch();
                  ModulesModel.open('reminders')
                },function(error){
                  console.log("Appoitment notification has not been scheduled ",error);
                });
              }catch(e){
                console.log(e);
                BookingsModel.clearBranch();
                ModulesModel.open('reminders')
              }
            }, function (error){
              console.log("DDD", error)
            })
          })
        })
      });

    }

    makeReservationCtrl.bookAppointment = bookAppointment;
  })
