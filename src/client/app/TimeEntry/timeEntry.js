(function () {
    'use strict';
    var controllerId = 'timeEntry';
    angular.module('app').controller(controllerId, ['common', 'datacontext','memberService','$window', timeEntry]);

    function timeEntry(common, datacontext, memberService, $window) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'TimeEntry';
        vm.submit = submit;
        vm.openCalender = openCalender;
        vm.select = select;

        vm.weekOfYear = getSunday(new Date());
        vm.projectId = '';
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
        fetchProjectName();
        fetchWeekEntry();
        
        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Please Submit your Clarity Entry'); });
        }

        function fetchProjectName(){
            memberService.fetchProject({UserTeamId : Number($window.sessionStorage.UserTeamId)})
                .then(
                    function (data) {
                        // console.log('Successfully updated the data base');
                        vm.projectId = data.ProjectName;
                    },
                    function (data) {
                        // vm.error = 'Error: Invalid user or password';
                        // vm.welcome = '';
                    }
                );
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
            memberService.fetchTime({weekOfYear : vm.weekOfYear.toDateString(), UserTeamId : $window.sessionStorage.UserTeamId})
                .then(
                    function (data) {
                        if(data.ExpectedHrs){
                            vm.allocatedHrs = data.ExpectedHrs ;
                            vm.actualHrs = data.ActualHrs ;
                            vm.reasonDiff = data.Comments ;
                        }else{
                            vm.allocatedHrs = 40 ;
                            vm.actualHrs = '' ;
                            vm.reasonDiff = '' ;
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
                UserTeamId : Number($window.sessionStorage.UserTeamId)
            };

            memberService.enterTime(submittedData)
                .then(
                    function (data) {
                        console.log('Successfully updated the data base');
                    },
                    function (data) {
                        vm.error = 'Error: Invalid user or password';
                        vm.welcome = '';
                    }
                );

            console.log(JSON.stringify(submittedData));
            log('Data Submitted Successfully');
        }

        function select(){
            fetchWeekEntry();
        }

    }
})();