(function () {
    'use strict';
    var controllerId = 'report';
    angular.module('app').controller(controllerId, ['common', 'datacontext', report]);

    function report(common, datacontext) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'Report';

        activate();

        function activate() {
            //var promises = [getAvengerCount(), getAvengersCast()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }
    }
})();