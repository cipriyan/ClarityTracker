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
                .then(function () { 
                    // log('Please Submit your Clarity Entry'); 
                });
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
            clarityOperationService.fetchTime({weekOfYear : moment(vm.weekOfYear).format('MM/DD/YYYY'), UserTeamId : profile.Id})
                .then(
                    function (data) {
                        if(data[0] && data[0].ExpectedHrs){
                            vm.allocatedHrs = data[0].ExpectedHrs ;
                            vm.actualHrs = data[0].ActualHrs ;
                            vm.reasonDiff = data[0].Comments ;
                            vm.Id = data[0].Id;
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
                WeekStartDate : moment(vm.weekOfYear).format('MM/DD/YYYY'),
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
                        log('Successfully updated for the week');
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
                        log('Successfully Submitted for the week')
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
        }

        function select(){
            fetchWeekEntry();
        }

    }
})();