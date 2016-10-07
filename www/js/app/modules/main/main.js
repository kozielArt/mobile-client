/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.main', [
  'commons.models.modules'
])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.main', {
        url: '/main',
        views: {
          'content': {
            controller: 'MainCtrl as mainCtrl',
            templateUrl: 'js/app/modules/main/main.tmpl.html'
          }
        }
      });
  })
  .controller('MainCtrl', function ($stateParams, $ionicPopup, $scope, $cordovaLocalNotification, ModulesModel, AppointmentsModel, UserModel, AccountModel) {
    var mainCtrl = this;
    mainCtrl.notificationData = [];
    mainCtrl.appointments = [];
    mainCtrl.user = {};
    var date = new Date();


      UserModel.getUser().then(function (user) {
        mainCtrl.user = user;
        AccountModel.getAccount(mainCtrl.user.emailAddress).then(function (account) {
          mainCtrl.user.account = account;
          AppointmentsModel.getAll(mainCtrl.user.account._id).then(function () {
            mainCtrl.appointments = AppointmentsModel.getCurrentDayVisits(date);
          })
        })
      })

    ticketAction = function () {
      ModulesModel.open('ticket');
    }

    function showAppointment(appointment) {
      mainCtrl.selectedAppointment = appointment;
      console.log(mainCtrl.selectedAppointment)
      var confirmPopup = $ionicPopup.confirm({
        cancelText: "Usuń",
        title: 'Szczegóły wizyty',
        template: 'Wizyta w ' + mainCtrl.selectedAppointment.appointment.product.branch.name +"<br> " +
        "Usługa " + mainCtrl.selectedAppointment.appointment.service.name +"<br>",

      });
      confirmPopup.then(function (res) {
        if(res) {

        }
        else{
          AppointmentsModel.remove(mainCtrl.user.emailAddress, mainCtrl.selectedAppointment).then(function () {
            UserModel.getUser().then(function (user) {
              mainCtrl.user = user;
              AccountModel.getAccount(mainCtrl.user.emailAddress).then(function (account) {
                mainCtrl.user.account = account;
                AppointmentsModel.getAll(mainCtrl.user.account._id).then(function () {
                  mainCtrl.appointments = AppointmentsModel.getCurrentDayVisits(date);
                })
              })
            })
          })
        }
      });
    }

    mainCtrl.showAppointment = showAppointment;
    mainCtrl.ticketAction = ticketAction
  });
