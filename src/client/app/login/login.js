(function () {
    'use strict';

    var controllerId = 'login';

    angular.module('app')
        .controller(controllerId, ['$rootScope', '$http', '$window','common', login]);

    function login($rootScope, $http, $window, common) {
        var vm = this;

        vm.activate = activate;
        vm.isAuthenticated = false;
        vm.logout = logout;
        vm.message = '';
        vm.submit = submit;
        vm.user = {username: '', password: ''};
        vm.welcome = '';

        activate();

        function activate() {
            //logSuccess(config.appTitle + ' loaded!', null);
            common.activateController([], controllerId);
        }

        function submit() {
            $http
                .post('/authenticate', vm.user)
                .then(
                    function (data, status, headers, config) {
                        $window.sessionStorage.token = data.data.token;
                        vm.isAuthenticated = true;
                        $rootScope.user.isAuthenticated = true;
                        var encodedProfile = data.data.token.split('.')[1];
                        var profile = JSON.parse(url_base64_decode(encodedProfile));
                        $rootScope.user.profile = profile;
                        $window.sessionStorage.profile = JSON.stringify(profile);
                        vm.welcome = 'Welcome ' + profile.firstName + ' ' + profile.lastName;
                        $rootScope.user.welcome = vm.welcome;
                    },
                    function (data, status, headers, config) {
                        // Erase the token if the user fails to log in
                        delete $window.sessionStorage.token;
                        vm.isAuthenticated = false;

                        // Handle login errors here
                        vm.error = 'Error: Invalid user or password';
                        vm.welcome = '';
                    }
                );
        }

        function logout() {
            vm.welcome = '';
            vm.message = '';
            vm.isAuthenticated = false;
            delete $window.sessionStorage.token;
        };

        //this is used to parse the profile
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polyfill https://github.com/davidchambers/Base64.js
        }
    }
})();