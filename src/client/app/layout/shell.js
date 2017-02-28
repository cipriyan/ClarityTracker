(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
<<<<<<< HEAD
        ['$rootScope', 'common', 'config','$window', shell]);

    function shell($rootScope, common, config, $window) {
=======
        ['$rootScope', '$location', 'common', 'config', 'memberService', shell]);

    function shell($rootScope, $location, common, config, memberService) {
>>>>>>> 96a3af3a70067ef1490ba2b702d50c2a3d334f16
        var vm = this;
        var logSuccess = common.logger.success;
        var events = config.events;
        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };
<<<<<<< HEAD

        if(!$window.sessionStorage.authenticate){
            $rootScope.user = { isAuthenticated : false, profile : null };
        }else{
            $rootScope.user = {
                isAuthenticated : true,
                profile : $window.sessionStorage.profile,
                welcome : $window.sessionStorage.welcome
            };
        }


=======
>>>>>>> 96a3af3a70067ef1490ba2b702d50c2a3d334f16
        activate();

        function activate() {
            //logSuccess(config.appTitle + ' loaded!', null);
            common.activateController([checkProfileExists()], controllerId);
        }

        function checkProfileExists () {            
            return memberService.getUserProfile()
                    .then(function (data) {
                        if(data){
                            vm.user = {};
                            vm.user.profile = data;
                            vm.user.welcome = 'Welcome ' + data.FirstName + ' ' + data.LastName;
                            vm.user.isAuthenticated = true;
                            if($location.$$path === '/'){
                                $location.path('/timeEntry');
                            }
                        }
                    });
        }
        function toggleSpinner(on) { vm.isBusy = on; }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { 
                toggleSpinner(true); 
            }
        );

        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );

        $rootScope.$on(events.onLogout,
            function (data) { vm.user = {}; }
        );

        $rootScope.$on(events.onLogin,
            function (data) { checkProfileExists(); }
        );
    }
})();