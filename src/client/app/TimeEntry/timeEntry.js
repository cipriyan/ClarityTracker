(function () {
    'use strict';
    var controllerId = 'timeEntry';
    angular.module('app').controller(controllerId, ['common', 'datacontext', timeEntry]);

    function timeEntry(common, datacontext) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'TimeEntry';
        vm.submit = submit;

        vm.weekOfYear = new Date();
        vm.projectId = 'ITPR123456';
        vm.allocatedHrs = 40;
        vm.actualHrs = '';
        vm.reasonDiff = '';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Please Submit your Clarity Entry'); });
        }


        function submit(){
            var submittedData = {
                week : vm.weekOfYear,
                project : vm.projectId,
                allocatedHr : vm.allocatedHrs,
                actualHr : vm.actualHrs,
                reason : vm.reasonDiff
            };
            console.log(JSON.stringify(submittedData));
            log('Data Submitted Successfully');
        }

    }
})();