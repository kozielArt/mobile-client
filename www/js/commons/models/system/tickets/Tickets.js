/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('commons.models.system.tickets', [])
  .service('TicketsModel', function ($http, $q, $rootScope) {
    var serviceUrl = 'http://'+endpointAddress+'/rest';
    var service = this;

    var currentUserId;
    var nextUserId;
    var tickets;
    var currentTicket;

    function sendServingCalled(ticket) {
      currentTicket = ticket;
      $rootScope.$broadcast('ticket.serve.called', ticket)
    }

    function sendServingFinished(ticket) {
      currentTicket = ticket;
      $rootScope.$broadcast('ticket.serve.finished', ticket)
    }

    function sendTransfered(ticket){
      currentTicket = ticket;
      $rootScope.$broadcast('ticket.serve.waiting', ticket)
    }

    function sendRated(ticket){
      $rootScope.$broadcast('ticket.serve.rated',ticket);
    }

    function sendRemoved(ticket){
      $rootScope.$broadcast('ticket.serve.removed',ticket);
    }

    function cacheTickets(response) {
      currentUserId = nextUserId;
      tickets = response.data;
      return tickets;
    }


    function createTicket(branchId, serviceId, params) {
      var data = {branchId: branchId, serviceId: serviceId}
      if (params)
        data = angular.extend(data, params);
      return $http.post(serviceUrl + "/branches/" + branchId + "/services/" + serviceId + "/printTicket/", data).then(
        function (response) {
          var newTicket = response.data;
          if (tickets == undefined) {
            tickets = []
          }
          tickets.push(newTicket);
          return newTicket;
        }
      )
    }

    function getUserTickets(userId) {
      if (tickets && currentUserId == userId) {
        var deferred = $q.defer();
        deferred.resolve(tickets);
        return deferred.promise;
      } else {
        nextUserId = userId;
        return $http.get(serviceUrl + "/branches/:branchId/services/:serviceId/tickets/user/" + userId).then(cacheTickets).then(function (tickets) {
          return tickets;
        })
      }
    }

    function remove(ticketId) {
      tickets =[];

      var dataForRemove = {
        ticketId: ticketId
      }
      return $http.put(serviceUrl + '/deleteTicket', dataForRemove).then(function(response){
          var ticket = response.data;
          sendRemoved(dataForRemove);
          return ticket;
      })
    }

    function rateTicket(ticket, rating, comments) {
      console.log("Ticket service rating, comments and id", ticket.id, rating, comments)
      var data = {
        ticketId: ticket.id,
        userRating: rating,
        userComment: comments
      }

      return $http.post(serviceUrl + "/branches/:branchId/services/:serviceId/tickets/" + ticket.id + "/rate", data).then(function (response) {
        console.log("Tickets service, response updated ticket", response.data)
        var result = response.data;
        sendRated(ticket);
        return result;

      })
    }


    service.rateTicket = rateTicket;
    service.getUserTickets = getUserTickets;
    service.remove = remove;
    service.createTicket = createTicket;
    service.sendServingFinished = sendServingFinished;
    service.sendServingCalled = sendServingCalled;

    service.sendTransfered = sendTransfered;
  });
