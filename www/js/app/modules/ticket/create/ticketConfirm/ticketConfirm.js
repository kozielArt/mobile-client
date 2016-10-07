/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('app.modules.ticket.create.ticketConfirm', [])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.create.ticketConfirm', {
      url: '/ticketConfirm',
      views: {
        'ticketCreateForm': {
          controller: 'TicketConfirmCtrl as ticketConfirmCtrl',
          templateUrl: 'js/app/modules/ticket/create/ticketConfirm/ticketConfirm.tmpl.html'
        }
      }
    });
  })
  .controller('TicketConfirmCtrl', function ($stateParams, ServicesModel, TicketsCreateService, UserModel) {

    var ticketConfirmCtrl = this;

    ticketConfirmCtrl.user = {};
    ticketConfirmCtrl.selectedService = {};
    ticketConfirmCtrl.selectedBranch = {};
    ticketConfirmCtrl.status = 'READY_TO_PRINT';

    UserModel.getUser().then(function (user) {
      ticketConfirmCtrl.user = user;
      TicketsCreateService.getSelectedBranch().then(function (selectedBranch) {
        ticketConfirmCtrl.selectedBranch = selectedBranch;
        TicketsCreateService.getSelectedService().then(function (selectedService) {
          ticketConfirmCtrl.selectedService = selectedService;
        })
      })
    });

    function createTicket() {
      ticketConfirmCtrl.status = 'WAITING_FOR_ANSWER';
      TicketsCreateService.createTicket({mobileUsername: ticketConfirmCtrl.user.emailAddress}).then(
        function (ticket) {
          ticketConfirmCtrl.status = 'WAITING_FOR_SWITCH_TO_SERVE';
        },
        function () {
          ticketConfirmCtrl.status = 'READY_TO_PRINT';
        });
    }

    function cancel() {
      //TODO - anulownie drukowania biletu - przejscie do listy oddziałów
    }

    ticketConfirmCtrl.createTicket = createTicket;
    ticketConfirmCtrl.cancel = cancel;
  });
