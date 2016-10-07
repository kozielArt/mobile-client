/**
 * Created by Tomasz on 2015-10-28.
 */
angular.module('app.modules.ticket.serve', [
  'ionic',
  'ionic-ratings',
  'ds.clock',
  'commons.models.modules',
  'commons.models.system.tickets.store',
  'commons.models.system.tickets'

])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.serve', {
      url: '/serve',
      views: {
        'content@app': {
          controller: 'TicketServeCtrl as ticketServeCtrl',
          templateUrl: 'js/app/modules/ticket/serve/serve.tmpl.html'
        }
      }
    });
  })
  .controller('TicketServeCtrl', function ($scope, $window, $ionicPopup, $ionicPlatform, $timeout, $rootScope, ModulesModel, TicketsStore, TicketsModel) {
    var ticketServeCtrl = this;
    ticketServeCtrl.ticket;
    ticketServeCtrl.loading = false;
    ticketServeCtrl.comment = "";
    ticketServeCtrl.rating = 0;
    ticketServeCtrl.createTime = "";
    ticketServeCtrl.startTime = "";
    ticketServeCtrl.callTimeEnd = "";
    ticketServeCtrl.callTime = "";
    ticketServeCtrl.endTime = "";
    ticketServeCtrl.waitingTime = 0;
    ticketServeCtrl.servingTime = 0;

    function refreshWaitingTime() {

      try {
        var nowMs = new Date();
        var startTime = new Date(ticketServeCtrl.ticket.transaction.startTime).getTime();

        var time = new Date(nowMs.getTime() - startTime);
        time.setHours(time.getHours()-1);
        ticketServeCtrl.waitingTime = time.getTime();
      }catch(e){

      }
      if (ticketServeCtrl.ticket.transaction.status == "WAITING") {
        $timeout(function () {
          refreshWaitingTime();
        }, 1000);
      }
    }

    function refreshServingTime() {
      try {
        var nowMs = new Date();
        var callTime = new Date(ticketServeCtrl.ticket.transaction.callTime);
        var time = new Date(nowMs.getTime() - callTime.getTime());
        time.setHours(time.getHours()-1);
        ticketServeCtrl.servingTime = time.getTime();
      }catch(e){

      }
      $timeout(refreshServingTime, 1000);
    }


    $scope.ratingsObject = {
      iconOn: 'ion-ios-star',
      iconOff: 'ion-ios-star-outline',
      iconOnColor: '#0099FF',
      iconOffColor: '#0099FF',
      rating: 5,
      minRating: 1,
      callback: function (rating) {
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsCallback = function (rating) {
      ticketServeCtrl.rating = rating;
    };

    TicketsStore.getStoredTicket().then(
      function (currentTicket) {
        ticketServeCtrl.ticket = currentTicket;
        refreshWaitingTime();
      },
      function (noTicketError) {
        ModulesModel.open('ticket', {force: true});
      }
    )

    $scope.$on('ticket.store.updated', function (event, ticket) {
      TicketsStore.getStoredTicket().then(function (currentTicket) {
          ticketServeCtrl.ticket = currentTicket;
          refreshWaitingTime()
          if (ticketServeCtrl.ticket.watchActive == false) {
            if (ticketServeCtrl.ticket.endedTransactions && ticketServeCtrl.ticket.endedTransactions.length > 0) {
              ticketServeCtrl.callTimeEnd = Date.parse(ticketServeCtrl.ticket.endedTransactions[0].callTime);
              ticketServeCtrl.endTime = Date.parse(ticketServeCtrl.ticket.endedTransactions[0].endTime);
            }
          }else if (ticketServeCtrl.ticket.transaction.status == "SERVING") {
            ticketServeCtrl.startTime = Date.parse(ticketServeCtrl.ticket.transaction.startTime);
            ticketServeCtrl.callTime = Date.parse(ticketServeCtrl.ticket.transaction.callTime);
            refreshServingTime();
          }else if (ticketServeCtrl.ticket.transaction.status == "WAITING"){
            refreshWaitingTime()
          }
        },
        function (noTicketError) {
          ModulesModel.open('ticket', {force: true});
        }
      )

      ticketServeCtrl.createTime = Date.parse(ticketServeCtrl.ticket.createTime);
   //   ticketServeCtrl.callTime = Date.parse(ticketServeCtrl.ticket.transaction.callTime);

    });

    function rate() {
      TicketsModel.rateTicket(ticketServeCtrl.ticket._id, ticketServeCtrl.rating, ticketServeCtrl.comment).then(function () {

      });
    }

    ticketServeCtrl.rate = rate;
  });
