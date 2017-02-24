(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/dashboard',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    },
                    controller : 'dashboard',
                    controllerAs : 'dashboardCtrl'
                }
            }, {
                url: '/timeEntry',
                config: {
                    templateUrl: 'app/TimeEntry/timeEntry.html',
                    title: 'TimeEntry',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-dashboard"></i> TimeEntry'
                    },
                    controller : 'timeEntry',
                    controllerAs : 'timeEntryCtrl'
                }
            }, {
                url: '/',
                config: {
                    templateUrl: 'app/login/login.html',
                    title: 'login',
                    controller : 'login',
                    controllerAs : 'loginCtrl'
                }
            }, {
                url: '/report',
                config: {
                    title: 'Report',
                    templateUrl: 'app/report/report.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-lock"></i> Report'
                    },
                    controller : 'report',
                    controllerAs : 'reportCtrl'
                }
            }, {
                url: '/logout',
                config: {
                    title: 'logout',
                    templateUrl: 'app/login/login.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-lock"></i> Logout'
                    }
                }
            }
        ];
    }
})();