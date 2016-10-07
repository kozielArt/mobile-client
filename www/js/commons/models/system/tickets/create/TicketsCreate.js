/**
 * Created by Tomasz on 2015-10-08.
 */

angular.module('commons.models.system.tickets.create', [
  'commons.models.system.tickets',
  'commons.models.system.branches',
  'commons.models.system.services'
])
  .service('TicketsCreateService', function ($rootScope, $q, BranchesModel, ServicesModel, TicketsModel) {
    var service = this;

    var selectedBranch;
    var selectedService;
    var createdTicket;

    $rootScope.$on('ticket.create.created', clearAll);

    function onBranchSelect(branch) {
      selectedBranch = branch;
      $rootScope.$broadcast('ticket.create.branchSelected', branch)
    }

    function onServiceSelect(service) {
      selectedService = service;
      $rootScope.$broadcast('ticket.create.serviceSelected', service)
    }

    function onTicketCreate(ticket) {
      createdTicket = ticket;
      var convertedTicket = {
        origId: ticket.id,
        branchOrigId: ticket.branchId,
        serviceOrigId: ticket.currentVisitService.serviceId,
        branchId: ticket.parameterMap.branchId,
        serviceId: ticket.parameterMap.serviceId,
        subServiceOrigId: ticket.parameterMap.subServiceId,
        branchName: ticket.parameterMap.branchName,
        serviceName: ticket.currentVisitService.serviceExternalName,
        ticketId: ticket.ticketId,
        status: 'WAITING',
        transaction: {
          startTime: new Date()
        }
      }
      $rootScope.$broadcast('ticket.create.created', convertedTicket)
    }

    function selectBranch(branchId) {
      BranchesModel.getBranch(branchId).then(onBranchSelect);
    }

    function selectService(serviceId) {
      ServicesModel.getService(serviceId).then(onServiceSelect);
    }

    function createTicket(params) {
      return TicketsModel.createTicket(selectedBranch._id, selectedService._id, params).then(onTicketCreate);
    }

    function getSelectedBranch() {
      var deferred = $q.defer();
      if (selectedBranch)
        deferred.resolve(selectedBranch);
      else
        deferred.reject('selectedBranch.undefined');
      return deferred.promise;

    }

    function getSelectedService() {
      var deferred = $q.defer();
      if (selectedService)
        deferred.resolve(selectedService);
      else
        deferred.reject('selectedService.undefined');
      return deferred.promise;
    }

    function getCreatedTicket() {
      var deferred = $q.defer();
      if (createdTicket)
        deferred.resolve(createdTicket);
      else
        deferred.reject('createdTicket.undefined');
      return deferred.promise;
    }

    function clearBranch() {
      selectedBranch = undefined;
      $rootScope.$broadcast('ticket.create.branchCleared')
    }

    function clearService() {
      selectedService = undefined;
      $rootScope.$broadcast('ticket.create.serviceCleared')
    }

    function clearAll() {
      selectedBranch = undefined;
      selectedService = undefined;
      createdTicket = undefined;
    }

    service.selectBranch = selectBranch;
    service.selectService = selectService;
    service.createTicket = createTicket;
    service.getSelectedBranch = getSelectedBranch;
    service.getSelectedService = getSelectedService;
    service.getCreatedTicket = getCreatedTicket;
    service.clearBranch = clearBranch;
    service.clearService = clearService;
    service.clearAll = clearAll;

  });
