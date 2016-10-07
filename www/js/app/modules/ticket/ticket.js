/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.ticket', [
  'app.modules.ticket.create',
  'app.modules.ticket.book',
  'app.modules.ticket.serve',
  'commons.models.system.tickets.store'
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket', {
      url: '/ticket',
      views: {
        'content@app': {
          controller: 'TicketCtrl as ticketCtrl',
          templateUrl: 'js/app/modules/ticket/ticket.tmpl.html'
        }
      }
    });
  })
  .controller('TicketCtrl', function ($stateParams, $scope, $rootScope, ModulesModel, TicketsStore, UserModel) {
    var ticketCtrl = this;
    ticketCtrl.user = {};
    ticketCtrl.loading = true;
    ticketCtrl.storedTicket;

    $scope.$on('$ionicView.enter', function() {
      ticketCtrl.loading = true;
      UserModel.getUser().then(function (user) {
        ticketCtrl.user = user
      })

      TicketsStore.getStoredTicket().then(
        function onSuccess(ticket) {
          ticketCtrl.storedTicket = ticket;
          ticketCtrl.loading = false;

        },
        function onError(reason) {
          ticketCtrl.storedTicket = undefined;
          ticketCtrl.loading = false;
        }
      )
    })

    function createTicket() {
      ModulesModel.open('ticket', {force: true, state: 'create'});
    }
    function displayTicket() {
      ModulesModel.open('ticket', {force: true, state: 'serve'});
    }
    function createAppointment() {
      ModulesModel.open('ticket', {force: true, state: 'book'});
    }

    ticketCtrl.createTicket = createTicket;
    ticketCtrl.createAppointment = createAppointment;
    ticketCtrl.displayTicket=displayTicket;
  });
