/**
 * Created by ArturK on 2015-10-19.
 */
angular.module('commons.models.system.bookings', [])
  .service('BookingsModel', function ($http, $q, $rootScope, UserModel) {
    var model = this;
    var serviceUrl = 'http://'+endpointAddress+'/ic-calendar/rest/connectors/appointments';
    var mobileBackendUrl = 'http://'+endpointAddress+'/rest';
    var username = 'calendar';
    var password = 'calendar';
    var branches;
    var selectedBranch;
    var branchIdToSelect;
    var selectedBranchProducts;
    var selectedProduct;
    var productIdToSelect;
    var selectedBranchProductDates;
    var selectedBranchProductDate;
    var dateToSelect;
    var selectedBranchProductDateHours;
    var selectedBranchProductDateHour;
    var selectedBranchProductDateResource;
    var reservation;
    var appointment;

    var cacheBranches = function (promise) {
      branches = promise.data.branches;
      return branches;
    };

    var cacheBranchProducts = function (promise) {
      _.each(branches, function (branch) {
        if (branch.id === branchIdToSelect) {
          selectedBranch = branch;
          $rootScope.$broadcast('ticket.book.serviceSelected', branch);
        }
      });
      selectedBranchProducts = promise.data.products;
      return selectedBranchProducts;
    };

    var cacheBranchProductDates = function (promise) {
      _.each(selectedBranchProducts, function (product) {
        if (product.id === productIdToSelect) {
          selectedProduct = product;
          $rootScope.$broadcast('ticket.book.dateSelected', product);
        }
      });
      selectedBranchProductDates = promise.data.days;
      return selectedBranchProductDates;
    };

    var cacheBranchProductDateHours = function (promise) {
      _.each(selectedBranchProductDates, function (date) {
        if (date.date === dateToSelect) {
          selectedBranchProductDate = date;
          $rootScope.$broadcast('ticket.book.hourSelected', selectedBranchProductDate);
        }
      });

      for (var availability in promise.data.day.availabilities) {
        var a = promise.data.day.availabilities[availability];
        selectedBranchProductDateHours = a.timePeriods
        selectedBranchProductDateResource = a.resources;
        break;
      }
      return selectedBranchProductDateHours;
    };

    var cacheReservationData = function (promise) {
      reservation = promise.data.appointment;
      $rootScope.$broadcast('ticket.book.reservationMade');
      return reservation;
    };

    var cacheAppointmentData = function (promise) {
      appointment = promise.data.appointment;
      return appointment;
    };

    var clearAppointmentData = function (promise) {
      appointment = null;
      return promise.data;
    };

    var saveAppointment = function (userId) {
      var appointmentData = {
        userId: userId,
        appointment: appointment,
      }
      return $http.post(mobileBackendUrl + '/appointment', appointmentData).then(function (response) {
        var createdAppointment = response;
        return createdAppointment;
      })
    }

    var getSavedAppointment = function (userId){
      return $http.get(mobileBackendUrl + '/appointment/' + userId).then(function (response){
        var result = response.data;
        return result;
      })
    }

    var removeSavedAppointment = function(emailAddress, appointmentId){
      var dataForRemove = {
        emailAddress: emailAddress,
        id: appointmentId
      }
      return $http.put(mobileBackendUrl + '/appointment/delete', dataForRemove).then(function (response){
        var result = response.data;
        return result;
      })
    }

    var getBranches = function () {
      if (branches) {
        var deferred = $q.defer();
        deferred.resolve(branches);
        return deferred.promise;
      } else {
        return $http.post(serviceUrl + '/getBranchesList', {
          username: username,
          password: password,
          productId: 0
        }).then(cacheBranches);
      }
    };

    var getBranchProducts = function (branchId) {
      if (selectedBranch) {
        if (selectedBranch.id === branchId) {
          var deferred = $q.defer();
          deferred.resolve(selectedBranchProducts);
          return deferred.promise;
        }
      }
      branchIdToSelect = branchId;
      return $http.post(serviceUrl + '/getProductsList', {
        username: username,
        password: password,
        branchId: branchId
      }).then(cacheBranchProducts);

    };

    var getBranchProductDates = function (branchId, productId) {
      productIdToSelect = productId;
      return $http.post(serviceUrl + '/getDaysList', {
        username: username,
        password: password,
        branchId: branchId,
        productId: productId,
        fillAvailabilies: false
      }).then(cacheBranchProductDates);
    };

    var getBranchProductDateHours = function (branch, product, date) {
      selectedBranchProductDate = date;
      dateToSelect = date;
      var day = {};
      _.each(selectedBranchProductDates, function (d) {
        if (d.date == date) {
          day = d;
        }
      });
      return $http.post(serviceUrl + '/getDaysAvailabilitiesList',
        {
          username: username,
          password: password,
          day: day
        }
      ).then(cacheBranchProductDateHours);
    };

    var makeReservation = function (branchId, productId, date, startHour, resourceId) {
      selectedBranchProductDateHour = startHour;
      var day = {};
      _.each(selectedBranchProductDates, function (d) {
        if (d.date == date) {
          day = d;
        }
      });
      var hour = {};
      _.each(selectedBranchProductDateHours, function (h) {
        if (h.startDateTime == startHour) {
          hour = h;
        }

      });
      return $http.post(serviceUrl + '/makeReservation',
        {
          username: username,
          password: password,
          day: day,
          timePeriod: startHour
        }
      ).then(cacheReservationData);
    };

    var bookAppointment = function (appointment) {
      return $http.post(serviceUrl + '/bookAppointment',
        {
          username: username,
          password: password,
          appointment: appointment
        }
      ).then(cacheAppointmentData);
    };

    var cancelAppointment = function (appointment) {
      return $http.post(serviceUrl + '/cancelAppointment',
        {
          username: username,
          password: password,
          externalId: appointment.externalId
        }
      ).then(clearAppointmentData);
    };

    var getSelectedBranch = function () {
      var deferred = $q.defer();
      if (selectedBranch)
        deferred.resolve(selectedBranch);
      else
        deferred.reject("Branch not selected");
      return deferred.promise;
    };

    var getSelectedProductDate = function () {
      var deferred = $q.defer();
      if (selectedBranchProductDate)
        deferred.resolve(selectedBranchProductDate);
      else
        deferred.reject("Product not selected");
      return deferred.promise;
    };

    var getSelectedProductHour = function () {
      var deferred = $q.defer();
      if (selectedBranchProductDateHour)
        deferred.resolve(selectedBranchProductDateHour);
      else
        deferred.reject("Hour not selected");
      return deferred.promise;
    };

    var getSelectedProduct = function () {
      var deferred = $q.defer();
      if (selectedProduct)
        deferred.resolve(selectedProduct);
      else
        deferred.reject("Product not selected");
      return deferred.promise;
    };

    var getReservation = function () {
      var deferred = $q.defer();
      if (reservation)
        deferred.resolve(reservation);
      else
        deferred.reject("reservation not set");
      return deferred.promise;
    };

    var getAppointment = function () {
      var deferred = $q.defer();
      if (appointment)
        deferred.resolve(appointment);
      else
        deferred.reject("appointment not set");
      return deferred.promise;
    };

    function clearBranch() {
      selectedBranch = undefined;
      selectedBranchProducts = undefined;
      $rootScope.$broadcast('ticket.book.branchCleared')
    }

    model.saveAppointment = saveAppointment;
    model.getSavedAppointment = getSavedAppointment;
    model.removeSavedAppointment = removeSavedAppointment;
    model.getBranches = getBranches;
    model.getBranchProducts = getBranchProducts;
    model.getSelectedBranch = getSelectedBranch;
    model.getSelectedProduct = getSelectedProduct;
    model.getSelectedProductDate = getSelectedProductDate;
    model.getBranchProductDates = getBranchProductDates;
    model.getBranchProductDateHours = getBranchProductDateHours;
    model.getSelectedProductHour = getSelectedProductHour;
    model.makeReservation = makeReservation;
    model.bookAppointment = bookAppointment;
    model.getAppointment = getAppointment;
    model.getReservation = getReservation;
    model.cancelAppointment = cancelAppointment;
    model.clearBranch = clearBranch;
  });
