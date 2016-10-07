/**
 * Created by ArturK on 2015-11-02.
 */
angular.module('commons.models.system.reminders.appointments', [])
  .service('AppointmentsModel', function ($http, $q, $rootScope, BookingsModel) {
    var model = this;
    var serviceUrl = 'http://'+endpointAddress+'/rest';


    var currentUserId;
    var nextUserId;
    var appointments;

    function cacheAppointments(response) {
      currentUserId = nextUserId;
      appointments = response.data;
      return appointments;
    }

    function save(appointment, userId) {
      var appointmentData = {
        userId: userId,
        appointment: appointment,
      }
      return $http.post(serviceUrl + '/appointment', appointmentData).then(function (response) {
        var createdAppointment = response.data;
        if (appointments == undefined) {
          appointments = []
        }
        appointments.push(createdAppointment);
        return createdAppointment;
      })
    }

    function getAll(userId) {
      if (appointments && currentUserId == userId) {
        var deferred = $q.defer();
        deferred.resolve(appointments);
        return deferred.promise;
      } else {
        nextUserId = userId;
        return $http.get(serviceUrl + '/appointment/' + userId).then(cacheAppointments).then(function (appointments) {
          return appointments;
        })
      }
    }

    function remove(emailAddress, appointment) {
      var dataForRemove = {
        emailAddress: emailAddress,
        id: appointment.appointment.id
      }
      return $http.put(serviceUrl + '/appointment/delete', dataForRemove).then(function () {
        return BookingsModel.cancelAppointment(appointment).then(function (response) {
          var result = response.data;
          var userId = currentUserId;
          currentUserId = -1;
          appointments= [];
          return getAll(userId);;
        })
      })
    }

    function getCurrentDayVisits(date) {
      var currentDaysVisit = new Array();

        for (var i = 0; i < appointments.length; i++) {
          var dateToCompare = new Date(appointments[i].appointment.startDateTime).getDay().toString();
          if (Date.parse(dateToCompare) == Date.parse(date.getDay())) {
            currentDaysVisit.push(appointments[i])
          }
        }

      return currentDaysVisit;
    }



    model.save = save;
    model.getAll = getAll;
    model.getCurrentDayVisits = getCurrentDayVisits;
    model.remove = remove;
  });
