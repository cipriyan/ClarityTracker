(function () {
    'use strict';

    var serviceId = 'memberService';
    angular.module('app')
        .factory(serviceId, ['$http', '$location', 'common',  memberService]);

    function memberService($http, $location, common) {
        var $q = common.$q,
            $window = common.$window;

        var service = {
            authenticate: authenticate,
            getUserProfile: getUserProfile,
            logout: clearUserProfile
        };

        return service;

        function authenticate(credential) {
            return $http.post('/api/authenticate', credential)
                .then(function(data, status, headers, config) {
                        $window.localStorage.setItem('associateId', credential.username);
                        $window.sessionStorage.token = data.data.token;
                        $window.sessionStorage.profile = angular.toJson(data.data.data);
                        return data.data.data;
                }, function(error){
                    clearUserProfile();
                    console.log(error);
                    return error;
                });
        }

        function getUserProfile() {
            var userProfile = angular.fromJson($window.sessionStorage.getItem('profile'));
            var associateId = $window.localStorage.getItem('associateId');
            if(userProfile){
                return $q.when(userProfile);
            } else if(associateId) {
                var credential = { username : associateId };
                return authenticate(credential)
            } else {
                $location.path('/logout');
                return $q.when(null);
            }
        }

        function clearUserProfile() {
            $window.sessionStorage.clear();
            $window.localStorage.clear();
            $location.path('/');
        }
    }
})();