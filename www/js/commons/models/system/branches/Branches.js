/**
 * Created by Tomasz on 2015-10-08.
 */
angular.module('commons.models.system.branches', [])
  .service('BranchesModel', function ($http, $q) {
    var service = this;
    var serviceUrl = 'http://'+endpointAddress+'/rest';
    var branches;
    var branch;
    function getUpdatedBranches(){
      return getBranches().then(updateCurrentlyOpenStates,function (error) {
        console.log("Wystąpił błąd",error);
        return "Błąd";
      })
    }

    function getBranches() {
      if (branches!== undefined){
        var deferred = $q.defer();
        deferred.resolve(branches);
        return deferred.promise;
      } else {
        return $http.get(serviceUrl + '/branches').then(function (response) {
          branches = response.data;
          return branches;
        });
      }
    }

    function updateCurrentlyOpenStates(branches) {
      if (branches) {
        var now = new Date();
        _.forEach(branches, function (branch) {
          if (branch.openingHour && branch.closingHour){
            branch.currentlyOpen = false;
            var openingTimestamp = new Date();
            var closingTimestamp = new Date();
            openingTimestamp.setHours(branch.openingHour.substr(0,2));
            openingTimestamp.setMinutes(branch.openingHour.substr(3,2));
            closingTimestamp.setHours(branch.closingHour.substr(0,2));
            closingTimestamp.setMinutes(branch.closingHour.substr(3,2));
            if (now.getTime() >= openingTimestamp.getTime() && now.getTime() <= closingTimestamp.getTime() ){
              branch.currentlyOpen = true;
            }
          }else{
            branch.currentlyOpen = undefined;
          }

        });
      }
      return branches;
    }

    function getBranch(branchId) {

          return getBranches().then(function(branches){
            var branchToselect
            branches.forEach(function (branch){
              if (branch._id == branchId )
                branchToselect =  branch;
            })
            return branchToselect;
          });



    }

    service.getBranches = getUpdatedBranches;
    service.getBranch = getBranch;
  });

