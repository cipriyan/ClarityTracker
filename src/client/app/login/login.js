(function () {
    'use strict';

    var controllerId = 'login';

    angular.module('app')
        .controller(controllerId, ['$rootScope', '$http', '$location','common', 'commonConfig', 'memberService', login]);

    function login($rootScope, $http, $location, common, commonConfig, memberService) {
        var vm = this;

        vm.activate = activate;
        vm.isAuthenticated = false;
        vm.message = '';
        vm.submit = submit;
        vm.user = {username: '', password: ''};
        vm.welcome = '';

        activate();

        function activate() {
            //logSuccess(config.appTitle + ' loaded!', null);
            //memberService.logout();
            common.activateController([], controllerId);
        }

        function submit() {
            memberService.authenticate(vm.user)
                .then(
<<<<<<< HEAD
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

                        $window.sessionStorage.authenticate = vm.isAuthenticated;
                        $window.sessionStorage.welcome = vm.welcome;
=======
                    function (data) {
                        //$rootScope.user.profile = data;
                        //$rootScope.user.isAuthenticated = true;
                        //vm.welcome = 'Welcome ' + data.FirstName + ' ' + data.LastName;
                        //$rootScope.user.welcome = vm.welcome;
                        common.$broadcast(commonConfig.config.onLogin, data)
                        $location.path('/timeEntry');
>>>>>>> 96a3af3a70067ef1490ba2b702d50c2a3d334f16
                    },
                    function (data) {
                        // Handle login errors here
                        vm.error = 'Error: Invalid user or password';
                        vm.welcome = '';
                    }
                );
        }
    }
})();