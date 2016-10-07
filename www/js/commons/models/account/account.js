/**
 * Created by ArturK on 2015-10-02.
 */
angular.module('commons.models.account', [])
  .service('AccountModel', function ($http) {
    var service = this;
    var serviceUrl = 'http://'+endpointAddress+'/rest';
    var account;
    var result;

    function createAccount(emailAddress, password, firstname, lastname, date) {
      var accountData = {
        emailAddress: emailAddress,
        password: password,
        firstName: firstname,
        lastName: lastname,
        created: date
      }
     return $http.post(serviceUrl + '/account', accountData).then(function (response) {
        var account = response.data;
        console.log("Account.js, createAccount(), response ",account)
        return account;
      })
    }

    function isEmailAvailable(emailAddress) {
      var data = {
        emailAddress: emailAddress,
      }
      return $http.post(serviceUrl + '/isEmailAvailable', data).then(function (response) {
          result = response.data;
          return result;
        })
    }

    function getAccount(emailAddress){
      return $http.get(serviceUrl + '/account/' + emailAddress).then(function (response){
        result = response.data;
        return result;
      })
    }

    function removeAccount(emailAddress, password){
      var dataForRemove = {
        emailAddress: emailAddress,
        password: password
      }
      return $http.put(serviceUrl + '/deleteAccount', dataForRemove).then(function (response){
        result = response.data;
        return result;
      })
    }

    function changePassword (emailAddress, oldPassword, newPassword, newPasswordConfirmed){
      var data = {
        emailAddress: emailAddress,
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswordConfirmed: newPasswordConfirmed
      }
      return $http.put(serviceUrl + '/changePassword', data).then(function (response){
        result = response.data;
        return result;
      })
    }

    function editAccount(emailAddress, data){
        return $http.put(serviceUrl + '/account/' + emailAddress, data).then(function (response){
          result = response.data;
          return response;
        })
    }

    service.createAccount = createAccount;
    service.isEmailAvailable = isEmailAvailable;
    service.getAccount = getAccount;
    service.removeAccount = removeAccount;
    service.changePassword = changePassword;
    service.editAccount = editAccount;
  });

