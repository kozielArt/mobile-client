/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.history', [])
  .config(function ($stateProvider) {
    $stateProvider.state('app.history', {
      url: '/history',
      views: {
        'content': {
          controller: 'HistoryCtrl as historyCtrl',
          templateUrl: 'js/app/modules/history/history.tmpl.html'
        }
      }
    });
  })
  .controller('HistoryCtrl', function ($stateParams, $ionicPopup, UserModel, TicketsModel) {
    var historyCtrl = this;
    historyCtrl.user = {};
    historyCtrl.selectedTicket = {};
    historyCtrl.tickets = {};

    UserModel.getUser().then(function(user){
      historyCtrl.user = user;
      TicketsModel.getUserTickets(historyCtrl.user.emailAddress).then(function(tickets){
        historyCtrl.tickets = tickets;
      })
    })

    function deleteTicket(ticket) {
      historyCtrl.selectedTicket = ticket;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Usuń bilet',
        template: 'Czy na pewno chcesz usunąć wybrany bilet?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          TicketsModel.remove(historyCtrl.selectedTicket._id).then(function () {
            TicketsModel.getUserTickets(historyCtrl.user.emailAddress).then(function (tickets) {
              historyCtrl.tickets = tickets;
            })
          })
        }
      });
    }

    historyCtrl.deleteTicket = deleteTicket;

  });
