/**
 * Created by Tomasz on 2015-10-31.
 */
angular.module('commons.handlers.app.ticket', [
    'commons.models.system.tickets.watch',
    'commons.models.modules'
  ])
  .service('CurrentTicketService', function ($q, $rootScope, ModulesModel, TicketsWatchService, TicketsModel) {

    var service = this;

    $rootScope.$on('ticket.create.created', function (event, ticket) {
      TicketsWatchService.startWatching(ticket);
      ModulesModel.open('ticket', {force: true, state: 'serve'});
    });

    $rootScope.$on('ticket.store.updated', function (event, ticket) {
      console.log("Recieved ticket.store.updated in CurrentTicketService",ticket  )
      if (ticket.transaction !== null) {
        if (ticket.transaction.startTime != undefined) {
          switch (ticket.transaction.status) {
            case 'SERVING':
              TicketsModel.sendServingCalled(ticket);
              break;
            case 'WAITING' :
              TicketsModel.sendTransfered(ticket);
              break;
            default :
              console.log("Unknown status in transaction", ticket.transaction);
              break;
          }
        }
      }
      if (ticket.transaction == null || (ticket.transaction && ticket.transaction.startTime == undefined)) {
        console.log("CurrentTicketService on (ticket.store.updated)", "ticket finished");
        TicketsWatchService.stopWatching();
        TicketsModel.sendServingFinished(ticket);
      }
    });

    $rootScope.$on('ticket.store.removed', function (event, ticket) {
      TicketsWatchService.startWatching(ticket);
      ModulesModel.open('ticket', {force: true});
    });

    function init() {
      TicketsWatchService.startWatching();
    }

    service.init = init;
  });
