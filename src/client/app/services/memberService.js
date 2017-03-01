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
            logout: clearUserProfile,
            enterTime : enterTime,
            fetchTime : fetchTime,
            fetchProject : fetchProject,
            fetchProjects : fetchProjects,
            fetchData : fetchData
        };

        return service;

        function authenticate(credential) {
            return $http.post('/authenticate', credential)
                .then(function(data, status, headers, config) {
                        $window.localStorage.setItem('associateId', credential.username);
                        $window.sessionStorage.token = data.data.token;
                        $window.sessionStorage.profile = angular.toJson(data.data.data);
                        $window.sessionStorage.UserTeamId = data.data.data.Id;
                        return data.data.data;
                }, function(error){
                    clearUserProfile();
                    console.log(error);
                    return error;
                });
        }

        function enterTime(credential) {
            return $http.post('/timeEntry', credential)
                .then(function(data, status, headers, config) {
                        console.log('successfully entered');
                }, function(error){
                    console.log(error);
                    return error;
                });
        }

        function fetchTime(credential){
            return $http.post('/fetchTimeEntry', credential)
                .then(function(data, status, headers, config) {
                        return data.data.data;
                }, function(error){
                    console.log(error);
                    return error;
                });
        }

        function fetchProject(credential){
            return $http.post('/fetchProject', credential)
                .then(function(data, status, headers, config) {
                        return data.data.data;
                }, function(error){
                    console.log(error);
                    return error;
                });
        }

        function fetchProjects(){
            return $http.post('/fetchProjects')
                .then(function(data, status, headers, config) {
                        return data.data.data;
                }, function(error){
                    console.log(error);
                    return error;
                });
        }

        function fetchData(credential){
            return $http.post('/fetchData', credential)
                .then(function(data, status, headers, config) {
                        return data.data.data;
                }, function(error){
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
                return $q.when(null);
                $location.path('/logout');
            }
        }

        function clearUserProfile() {
            $window.sessionStorage.clear();
            $window.localStorage.clear();
            $location.path('/');
        }
    }
})();