/**
 * Created by Tomasz on 2015-09-30.
 */
angular.module('app.modules.ticket.create', [
  'commons.models.system.tickets.create',
  'app.modules.ticket.create.branchSelect',
  'app.modules.ticket.create.serviceSelect',
  'app.modules.ticket.create.ticketConfirm'

])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.create', {
      url: '/create',
      views: {
        'content@app': {
          controller: 'TicketCreateCtrl as ticketCreateCtrl',
          templateUrl: 'js/app/modules/ticket/create/create.tmpl.html'
        }
      }
    });
  })
  .controller('TicketCreateCtrl', function ($scope, $stateParams, ModulesModel, TicketsCreateService) {
    var ticketCreateCtrl = this;
    ticketCreateCtrl.selectedBranch;
    ticketCreateCtrl.selectedService;
    ticketCreateCtrl.createdTicket;

    $scope.$on('$ionicView.enter', function () {

      TicketsCreateService.getSelectedBranch().then(
        function (selectedBranch) {
          ticketCreateCtrl.selectedBranch = selectedBranch;
          TicketsCreateService.getSelectedService().then(
            function (selectedService) {
              ticketCreateCtrl.selectedService = selectedService;
              TicketsCreateService.getCreatedTicket().then(
                function (ticket) {
                  ticketCreateCtrl.createdTicket = ticket;
                  ModulesModel.open('ticket', {force: true, state: 'create.ticketStatus'});
                },
                function (noTicketError) {
                  ModulesModel.open('ticket', {force: true, state: 'create.ticketConfirm'});
                }
              )
            },
            function (noServiceError) {
              ModulesModel.open('ticket', {force: true, state: 'create.serviceSelect'});
            }
          )
        },
        function (noBranchError) {
          ModulesModel.open('ticket', {force: true, state: 'create.branchSelect'});
        }
      )
    });

    $scope.$on('ticket.create.branchSelected', function (event, selectedBranch) {
      ticketCreateCtrl.selectedBranch = selectedBranch
      ModulesModel.open('ticket', {force: true, state: 'create.serviceSelect'})
    });

    $scope.$on('ticket.create.serviceSelected', function (event, selectedService) {
      ticketCreateCtrl.selectedService = selectedService
      ModulesModel.open('ticket', {force: true, state: 'create.ticketConfirm'})
    });

    $scope.$on('ticket.create.ticketCreated', function () {
    })

    function cancel() {
      if (ticketCreateCtrl.selectedBranch == undefined && ticketCreateCtrl.selectedService == undefined && ticketCreateCtrl.createdTicket == undefined) {
        ModulesModel.open("ticket");
      }
      else if (ticketCreateCtrl.selectedService == undefined && ticketCreateCtrl.createdTicket == undefined) {
        ticketCreateCtrl.selectedBranch = undefined;
        ModulesModel.open('ticket', {force: true, state: 'create.branchSelect'});
      }
      else if (ticketCreateCtrl.createdTicket == undefined) {
        ticketCreateCtrl.selectedService = undefined;
        ModulesModel.open('ticket', {force: true, state: 'create.serviceSelect'})
      }

    }

    ticketCreateCtrl.cancel = cancel;
  });
