/**
 * Created by Tomasz on 2015-10-08.
 */

angular.module('commons.models.system.tickets.store', [])
  .service('TicketsStore', function ($rootScope, $q, $window, TicketsModel) {
    /*
     eventy wysyłane:
     ticket.store.updated - po zapisaniu biletu do LS
     ticket.store.removed - po usunieciu biletu z LS
     */
    var service = this;
    var watchActive = false;
    //Utworzenie biletu przez connector create
    $rootScope.$on('ticket.create.created', function (event, ticket) {
      watchActive = false;
      save(ticket);
    })
    //Odebranie biletu z ws przy zapisaniu
    $rootScope.$on('ticket.watch.started', function (event, ticket) {
      watchActive = true;
      save(ticket);
    })
    //Aktualizacja biletu przez WS
    $rootScope.$on('ticket.watch.updated', function (event, ticket) {
      watchActive = true;
        save(ticket);
    })
    //ZAmkniecie ws
    $rootScope.$on('ticket.watch.stopped', function (event) {
      var ticket = _getStoredTicket();
      console.log("stopped, ticekt from local storage")
      watchActive = false;
      save(ticket);
    })
    //BIlet nie został odnaleziony
    $rootScope.$on('ticket.watch.notfound', function (event, ticket) {
      $window.localStorage.removeItem('ticket');
      $rootScope.$broadcast("ticket.store.removed");
    })
    //Ocenienie biletu
    $rootScope.$on('ticket.serve.rated', function (event, ticket) {
      $window.localStorage.removeItem('ticket');
      $rootScope.$broadcast("ticket.store.removed");
    })

    //Zapis obiektu biletu w localStorage
    function save(ticket) {
      if (ticket == undefined)
        return
      $window.localStorage.setItem('ticket', angular.toJson(ticket));
      $rootScope.$broadcast("ticket.store.updated", ticket)
    }

    function getStoredTicket() {
      var deferred = $q.defer();
      var ticketFromLocalStorage = _getStoredTicket();
      if (ticketFromLocalStorage) {
        ticketFromLocalStorage.watchActive = watchActive;
        deferred.resolve(ticketFromLocalStorage);
      }
      else
        deferred.reject('TicketsStore.ticketNotFoundInStore');
      return deferred.promise;
    }

    function _getStoredTicket() {
      return angular.fromJson($window.localStorage.getItem('ticket'));
    }

    service.getStoredTicket = getStoredTicket;
  })
;
