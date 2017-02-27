(function () {
    'use strict';

    var controllerId = 'logout';

    angular.module('app')
        .controller(controllerId, ['$rootScope', '$location', 'common', 'commonConfig', 'memberService', logout]);
    function logout($rootScope, $location, common, commonConfig, memberService)  {
    	activate();

        function activate() {
            common.activateController([], controllerId);
            memberService.logout();
            common.$broadcast(commonConfig.config.onLogout)
        }
    }
})();