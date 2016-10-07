/**
 * Created by Tomasz on 2015-10-31.
 */
angular.module('commons.models.system.tickets.watch', [
  'commons.handlers.websocket.client',
  'commons.models.system.tickets.store'
])
  .service('TicketsWatchService', function ($rootScope, $q, ModulesModel, TicketsStore, WSClientService) {

    var service = this;
    var connectionFailures = 0, MAX_CONNECTION_FAILURES = 10, RENEW_CONNECTION_INTERVAL = 2000;
    var watchingFailures = 0, MAX_WATCHING_FAILURES = 5, RENEW_WATCHING_INTERVAL = 2000;
    var isWatchActive = false;
    var ticketToRegister;
    var expectToClose = false;

    function stopWatching() {
      expectToClose = true;
      WSClientService.disconnect();
    }

    function startWatching() {
      //Wczytanie biletu z TicketStore
      if (isWatchActive) {
        //Mamy już aktywny kanał
        console.debug('Ticket already in watch mode');
      } else {
        //Nie mamy aktywnego kanału
        TicketsStore.getStoredTicket().then(
          function onSuccess(ticket) {
            //Sprawdzamy czy napewno jest bilet
            if (ticket && ticket != null) {
              //Sprawdzamy czynasz bilet nie został już zakonczony - wtedy nie zapisujemy sie juz do WS. Sprawdzmay pole ticket.transaction.startTime
              if ((ticket.transaction && ticket.transaction.startTime) || ticket.id) {
                //Mamy bilet z aktywną transakcją i nie jestesmy połączeni
                if (connectionFailures <= MAX_CONNECTION_FAILURES) {
                  //Rejestrujemy handlery
                  ticketToRegister = ticket;
                  WSClientService.registerOperationHandler('TICKET_UPDATED', service.onTicketUpdate);
                  WSClientService.registerOperationHandler('WATCH_TICKET_STARTED', service.onTicketWatchStart);
                  WSClientService.registerOperationHandler('WATCH_TICKET_ERROR', service.onTicketWatchStartFailure);
                  WSClientService.registerLifecycleHandler('onOpen', service.onConnectionEstablished);
                  WSClientService.registerLifecycleHandler('onClose', service.onConnectionClose);
                  //Próbujemy sie połączyć
                  WSClientService.connect();
                } else {
                  //Po wielu próbach poddajemy sie
                  console.error('Too many failed ws connections');
                }
              } else {
                //Bilet został już prawdopodobnie zakończony
                console.debug('Ticket already closed');
              }
            }
          },
          function onFailure(reason) {
            //Nie mamy zapisanego obserwowanego biletu.
            console.log('Nie ma biletu w storage', reason)
          }
        );
      }
    }

    function onConnectionEstablished() {
      connectionFailures = 0;
      sendWatchTicketRequest();
    }

    function sendWatchTicketRequest() {
      WSClientService.sendEvent('WATCH_TICKET',
        {
          origId: ticketToRegister.origId ? ticketToRegister.origId : ticketToRegister.id,
          branchOrigId: ticketToRegister.branchOrigId ? ticketToRegister.branchOrigId : ticketToRegister.branchId
        }
      );
    }

    function onConnectionClose() {
      if (expectToClose) {
        $rootScope.$broadcast('ticket.watch.stopped');
      } else {
        $rootScope.$broadcast('ticket.watch.stopped');
        connectionFailures++;
        setTimeout(function () {
          startWatching();
        }, RENEW_CONNECTION_INTERVAL);
      }
    }

    function onTicketUpdate(operation, data) {
      var ticket = data;
      ticket.watchActive = true;
      $rootScope.$broadcast('ticket.watch.updated', ticket);
    }

    function onTicketWatchStart(operation, data) {
      var ticket = data.ticket;
      ticket.watchActive = true;
      ticketToRegister = undefined;
      watchingFailures = 0;
      $rootScope.$broadcast('ticket.watch.started', data.ticket);
    }

    function onTicketWatchStartFailure(operation, ticket) {
      watchingFailures++;
      if (watchingFailures <= MAX_WATCHING_FAILURES) {
        setTimeout(function () {
          sendWatchTicketRequest()
        }, RENEW_WATCHING_INTERVAL);
      } else {
        console.error('Too many failed ws connections ');
        //TODO Na razie przestajemy się łaczyć - skoro nie ma naszego biletu, to znaczy że coś jest nie tak. Moze go usunać ze store?
        $rootScope.$broadcast('ticket.watch.notfound', ticket);
        connectionFailures = MAX_CONNECTION_FAILURES;
        WSClientService.disconnect();
      }
    }

    service.startWatching = startWatching;
    service.stopWatching = stopWatching;
    service.onTicketUpdate = onTicketUpdate;
    service.onTicketWatchStart = onTicketWatchStart;
    service.onTicketWatchStartFailure = onTicketWatchStartFailure;
    service.onConnectionEstablished = onConnectionEstablished;
    service.onConnectionClose = onConnectionClose;
  }
);
