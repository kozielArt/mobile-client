/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.reminders', [
  'commons.models.system.reminders.appointments',
  'commons.models.user',
  'commons.models.account'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.reminders', {
      url: '/reminders',
      views: {
        'content': {
          controller: 'RemindersCtrl as remindersCtrl',
          templateUrl: 'js/app/modules/reminders/reminders.tmpl.html'
        }
      }
    });
  })
  .controller('RemindersCtrl', function ($stateParams, $scope, $ionicPopup, AppointmentsModel, UserModel, AccountModel) {
    var remindersCtrl = this;

    remindersCtrl.user = {};
    remindersCtrl.appointments = [];
    remindersCtrl.selectedAppointment = {};
    remindersCtrl.loading = true;


    UserModel.getUser().then(function (user) {
      remindersCtrl.user = user;
      AccountModel.getAccount(remindersCtrl.user.emailAddress).then(function (account) {
        remindersCtrl.user.account = account;
        AppointmentsModel.getAll(remindersCtrl.user.account._id).then(function (appointments) {
          remindersCtrl.appointments = appointments;
          remindersCtrl.loading = false;

        })
      })
    })

    function deleteAppointment(appointment) {
      remindersCtrl.selectedAppointment = appointment;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Usuń wizytę',
        template: 'Czy na pewno chcesz usunąć wybrana wizytę?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          remindersCtrl.loading = true;
          AppointmentsModel.remove(remindersCtrl.user.emailAddress, remindersCtrl.selectedAppointment).then(function (appointments) {
              remindersCtrl.appointments = appointments;
                remindersCtrl.loading = false;

            })
        }
      });
    }

    remindersCtrl.deleteAppointment = deleteAppointment;
  });
