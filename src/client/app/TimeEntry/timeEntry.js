(function () {
    'use strict';
    var controllerId = 'timeEntry';
    angular.module('app').controller(controllerId, ['common', 'datacontext', timeEntry]);

    function timeEntry(common, datacontext) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'TimeEntry';
        vm.submit = submit;
        vm.openCalender = openCalender;

        vm.weekOfYear = getSunday(new Date());
        vm.projectId = 'ITPR123456';
        vm.allocatedHrs = 40;
        vm.actualHrs = '';
        vm.reasonDiff = '';
        vm.calender = {
            opened : false
        };
        
        vm.dateOptions = {
            dateDisabled: disabled,
            showWeeks: false
        };

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Please Submit your Clarity Entry'); });
        }

        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && !(date.getDay() === 0 );
        }

        function openCalender(){
            vm.calender.opened = !vm.calender.opened;
        }

        function getSunday(d) {
            d = new Date(d);
            var day = d.getDay(),
            diff = d.getDate() - day; 
            return new Date(d.setDate(diff));
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