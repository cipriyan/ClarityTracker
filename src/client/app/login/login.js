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
                    function (data) {
                        //$rootScope.user.profile = data;
                        //$rootScope.user.isAuthenticated = true;
                        //vm.welcome = 'Welcome ' + data.FirstName + ' ' + data.LastName;
                        //$rootScope.user.welcome = vm.welcome;
                        common.$broadcast(commonConfig.config.onLogin, data)
                        $location.path('/timeEntry');
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