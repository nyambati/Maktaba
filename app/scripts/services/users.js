angular.module('maktaba.services')
  .factory('Users', ['$resource', '$http', function($resource, $http) {
    var obj = $resource('/api/users/:id', {
      id: '@id'
    }, {
      update: {
        // this method issues a PUT request
        method: 'PUT'
      }
    }, {
      stripTrailingSlashes: false
    });

    obj.login = function(user, cb) {
      $http.post('/api/users/login', user).success(function(res) {
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    obj.user = function(cb) {
      $http.get('/api/me').success(function(res) {
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    obj.logout = function(user, cb) {
      $http.get('/api/users/logout', user).success(function(res) {
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    return obj;
  }]);