(function () {
    'use strict';
    var controllerId = 'timeEntry';
    angular.module('app').controller(controllerId, ['common', 'datacontext','clarityOperationService','$window', timeEntry]);

    function timeEntry(common, datacontext, clarityOperationService, $window) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'TimeEntry';
        vm.submit = submit;
        vm.openCalender = openCalender;
        vm.select = select;

        vm.weekOfYear = getSunday(new Date());
        var profile = angular.fromJson($window.sessionStorage.profile);
        vm.projectId = profile.ProjectName;
        vm.allocatedHrs = 40;
        vm.actualHrs = '';
        vm.reasonDiff = '';
        vm.calender = {
            opened : false
        };
        vm.Id = '';
        vm.dateOptions = {
            dateDisabled: disabled,
            showWeeks: false
        };

        activate();
        
        function activate() {
            var promises = [fetchWeekEntry()];
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

        function fetchWeekEntry(){
            clarityOperationService.fetchTime({weekOfYear : vm.weekOfYear.toDateString(), UserTeamId : profile.Id})
                .then(
                    function (data) {
                        if(data.ExpectedHrs){
                            vm.allocatedHrs = data.ExpectedHrs ;
                            vm.actualHrs = data.ActualHrs ;
                            vm.reasonDiff = data.Comments ;
                            vm.Id = data.Id;
                        }else{
                            vm.allocatedHrs = 40 ;
                            vm.actualHrs = '' ;
                            vm.reasonDiff = '' ;
                            vm.Id = '';
                        }
                    },
                    function (data) {
                        // vm.error = 'Error: Invalid user or password';
                        // vm.welcome = '';
                    }
                );
        }

        function submit(){
            var submittedData = {
                WeekStartDate : vm.weekOfYear.toDateString(),
                ExpectedHrs : vm.allocatedHrs,
                ActualHrs : vm.actualHrs,
                Comments : vm.reasonDiff,
                IsActive : true,
                UserTeamId : profile.Id
            };

            if(vm.Id){
                submittedData.Id = vm.Id; 
                clarityOperationService.updateTime(submittedData)
                .then(
                    function (data) {
                        console.log('Successfully updated the data base');
                        vm.allocatedHrs = 40 ;
                        vm.actualHrs = '' ;
                        vm.reasonDiff = '' ;
                    },
                    function (data) {
                        vm.error = 'Error: Invalid user or password';
                        vm.welcome = '';
                    }
                );
            }else{
                clarityOperationService.enterTime(submittedData)
                .then(
                    function (data) {
                        console.log('Successfully Entered into the data base');
                        vm.allocatedHrs = 40 ;
                        vm.actualHrs = '' ;
                        vm.reasonDiff = '' ;
                    },
                    function (data) {
                        vm.error = 'Error: Invalid user or password';
                        vm.welcome = '';
                    }
                );
            }

            console.log(JSON.stringify(submittedData));
            log('Data Submitted Successfully');
        }

        function select(){
            fetchWeekEntry();
        }

    }
})();