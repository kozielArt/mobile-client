/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('commons.models.system.services', [])
  .service('ServicesModel', function ($http, $q) {
    var serviceUrl = 'http://'+endpointAddress+'/rest';
    var selectedBranchId;
    var branchIdToSelect;
    var service = this;
    var services;
    var selectedService;

      function getServices(branchId) {
        if (services && selectedBranchId === branchId) {
          var deferred = $q.defer();
          deferred.resolve(services);
          return deferred.promise;
        } else {
          branchIdToSelect = branchId;
          return $http.get(serviceUrl + '/branches/' + branchId + '/services/').then(function (response) {
            selectedBranchId = branchIdToSelect;
            services = response.data;
            return services;
          })
        }
      }


      function getService(serviceId) {
        return getServices(branchIdToSelect).then(function (services) {
          var serviceToSelect;
          services.forEach(function (service) {
            if (service._id == serviceId)
              serviceToSelect = service;
          })
          return serviceToSelect;
        });
      }

    service.getServices = getServices;
    service.getService = getService;
  });

