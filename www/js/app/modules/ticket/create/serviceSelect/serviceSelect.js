/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('app.modules.ticket.create.serviceSelect', [
  'commons.models.system.branches',
])
  .config(function ($stateProvider) {
    $stateProvider.state('app.ticket.create.serviceSelect', {
      url: '/serviceSelect',
      views: {
        'ticketCreateForm': {
          controller: 'ServiceSelectCtrl as serviceSelectCtrl',
          templateUrl: 'js/app/modules/ticket/create/serviceSelect/serviceSelect.tmpl.html'
        }
      }
    });
  })
  .controller('ServiceSelectCtrl', function ($stateParams, $scope, TicketsCreateService, ServicesModel) {
    var serviceSelectCtrl = this;
    serviceSelectCtrl.services = {};
    serviceSelectCtrl.noServicesAvailable = false;
    serviceSelectCtrl.loading = true;
    serviceSelectCtrl.selectedBranch= {};

      TicketsCreateService.getSelectedBranch().then(function(selectedBranch){
        serviceSelectCtrl.selectedBranch = selectedBranch;
        ServicesModel.getServices(selectedBranch._id).then(function (services) {
          var tmpServices = []
          _.forEach(services , function(service){
           // if (service.status == 'AVAILABLE')
              tmpServices.push(service)
          })
          serviceSelectCtrl.services = tmpServices;
          if (serviceSelectCtrl.services.length == 0)
            serviceSelectCtrl.noServicesAvailable = true;
          serviceSelectCtrl.loading = false;
        })
      });

    selectService = function (service) {
      TicketsCreateService.selectService(service._id);
    }

    serviceSelectCtrl.selectService = selectService;
  });
