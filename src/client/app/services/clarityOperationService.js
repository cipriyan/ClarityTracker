(function () {
    'use strict';

    var serviceId = 'clarityOperationService';
    angular.module('app')
        .factory(serviceId, ['$http', '$location', 'common',  clarityOperationService]);

    function clarityOperationService($http, $location, common) {
        var $q = common.$q,
            $window = common.$window;

        var service = {
            enterTime : enterTime,
            fetchTime : fetchTime,
            fetchProjects : fetchProjects,
            fetchData : fetchData
        };

        return service;

        

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

    }
})();