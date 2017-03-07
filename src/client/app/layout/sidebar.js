(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'routes','$window', sidebar]);

    function sidebar($route, routes, $window) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.isAdmin = false;

        activate();

        function activate() { 
            checkAdmin();
            getNavRoutes(); 
        }

        function checkAdmin(){
            var profile = angular.fromJson($window.sessionStorage.profile);
            vm.isAdmin = profile.IsAdmin;
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
})();