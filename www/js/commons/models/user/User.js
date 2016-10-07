/**
 * Created by Tomasz on 2015-10-01.
 */
angular.module('commons.models.user', [])
  .service('UserModel', function ($http, $q, $rootScope, $window) {
    var service = this;
    var serviceUrl = 'http://'+endpointAddress+'/rest';
    var user;
    var rememberedUser;
    var isUserAuthenticated = false;

    function rememberUser() {
      if(user != undefined || user!= null){
        user.isRemembered = true;
      $window.localStorage.setItem('user', angular.toJson(user));
      }
    }

    function forgetUser() {
      $window.localStorage.removeItem('user');
    }

    function getUserFromLocalStorage() {
      var userFromLocalStorage = angular.fromJson($window.localStorage.getItem('user'));
      return userFromLocalStorage;
    }

    function setUser(userToSet) {
      user = userToSet;
      return user;
    }

    function getUser() {
      var deferred = $q.defer();
      if (user !== undefined) {
        deferred.resolve(user);
      } else {
        var userFromLocalStorage = getUserFromLocalStorage();
        if (userFromLocalStorage !== undefined && userFromLocalStorage !== null ) {
          setUser(userFromLocalStorage);
          deferred.resolve(user);
          $rootScope.$broadcast('user.login');
        }else{
          deferred.reject("User not logged")
        }
      }
      return deferred.promise;
    }

    function checkCredentials(emailAddress, password) {
      var loginData = {
        emailAddress: emailAddress,
        password: password
      }

      return $http.post(serviceUrl + '/checkCredentials', loginData).then(function (promise){
          return promise.data;
        }
      );
    };
    function login(username, password, rememberMe) {
      return checkCredentials(username, password).then(function (result) {
        if (result !== undefined) {
          setUser(result);
          if (rememberMe) {
            rememberUser();
            $rootScope.$broadcast("user.login");
          }
          return true;
        }
        return false;
      },function (result){
        return false;
      })
      ;
    };

    function logout() {
      user = {};
      forgetUser();
      $rootScope.$broadcast("user.logout");

    };

    function authenticateUser(password) {
      if (user === undefined)
        return false;
      return checkCredentials(user.emailAddress, user.password).then(setUser, function(){
        //TODO autentykacja nie powiodła się cos trzeba zrobić / zwrócić
      }).then(function () {
        $rootScope.$broadcast("user.login");
      });
    }

    function isRemembered() {
      if (user === undefined || user === null){
        return undefined;
      }else {
        return user.isRemembered;
      }
    };
    function isAuthenticated() {
      if (user)
        return user.isAuthenticated;
    };

    service.isRemembered = isRemembered;
    service.isAuthenticated = isAuthenticated;
    service.logout = logout;
    service.login = login;
    service.authenticateUser = authenticateUser;
    service.getUser = getUser;

  });
