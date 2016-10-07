/**
 * Created by Tomasz on 2015-12-09.
 */
angular.module('commons.models.device.notifications', [
    'ngCordova',
    'commons.models.modules'

  ])
  .service('NotificationsService', function ($rootScope, ModulesModel, $cordovaLocalNotification,$ionicPopup) {

    $rootScope.$on("ticket.serve.waiting", function (event, ticket) {
      console.log("ticket.serve.waiting recieved in NotificationsService");
      ModulesModel.open('ticket', {force: true, state: 'serve'});
      $cordovaLocalNotification.schedule({
        id: ticket.origId,
        at: new Date(),
        text: "Prosze oczekiwać na przywołanie.",
        title: "Twój numer oczekuje na obsługę do " + ticket.transaction.queueName,
        ongoing: true
      }).then(function () {
        console.log("The notification for waiting service has been set, menu");
      });
    })
    $rootScope.$on("ticket.serve.called", function (event, ticket) {
      console.log("ticket.serve.called recieved in NotificationsService");
      ModulesModel.open('ticket', {force: true, state: 'serve'});
      $cordovaLocalNotification.schedule({
        id: ticket.origId,
        at: new Date(),
        text: "Przejdź do " + ticket.transaction.servicePointName,
        title: "Twój numer został przywołany",
        ongoing: true
      }).then(function () {
        console.log("The notification for started service has been set, mwenu");
      });
    })


    $rootScope.$on("ticket.serve.finished", function (event, ticket) {
      console.log("ticket.serve.finished recieved in NotificationsService");
      ModulesModel.open('ticket', {force: true, state: 'serve'});
      $cordovaLocalNotification.schedule({
        id: ticket.origId,
        at: new Date(),
        text: "Dziękujemy za wizytę",
        title: "Obsługa została zakończona.",
        ongoing: false
      }).then(function () {
        console.log("The notification for finished  has been set, menu");
      });
    })

    $rootScope.$on("ticket.serve.rated", function (event, ticketId) {
      console.log("ticket.serve.rated recieved in NotificationsService");
      $cordovaLocalNotification.cancel(ticketId);
      var alertPopup = $ionicPopup.alert({
        title: 'Dziekujemy za ocenę!',
        template: 'Twoja opinia zostanie wykorzystana do poprawy jakości obsługi.'
      });
    })

  });
