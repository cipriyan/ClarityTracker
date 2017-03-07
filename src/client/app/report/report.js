(function () {
    'use strict';
    var controllerId = 'report';
    angular.module('app').controller(controllerId, ['common', 'datacontext','clarityOperationService','$window', report]);

    function report(common, datacontext, clarityOperationService, $window) {
        var log = common.logger.info;
        var vm = this;
        vm.title = 'Report';
        vm.submit = submit;
        vm.openCalender1 = openCalender1;
        vm.openCalender2 = openCalender2;
        vm.downloadExcel = downloadExcel;

        vm.dateOptions = {
            dateDisabled: disabled,
            showWeeks: false
        };

        vm.calender1 = {
            opened : false
        };

        vm.calender2 = {
            opened : false
        };

        vm.startWeek = '';
        vm.endWeek = '';
        vm.projectId = '';
        vm.projectList = [];

        vm.showTable = false;
        vm.table_headers =['EmpID','Name','Project','WeekStartDate','Allocated Hrs','Actual Hrs','Comments','Hrs Difference'];
        // vm.fetchedData = [
        //     {
        //         empId : '441296',
        //         name : 'Arindam',
        //         project : 'ICE',
        //         allocated : '40',
        //         actual : '40'
        //     },
        //     {
        //         empId : '441297',
        //         name : 'Sourav',
        //         project : 'Digital',
        //         allocated : '40',
        //         actual : '40'
        //     }
        // ];

        vm.fetchedData = [];

        activate();

        // fetchProjects();

        function fetchProjects(){
            clarityOperationService.fetchProjects()
                .then(
                    function (data) {
                        var fetData =data;
                        for(var i=0;i<fetData.length;i++){
                            vm.projectList.push(fetData[i].ProjectName);
                        }
                    },
                    function (data) {
                        // vm.error = 'Error: Invalid user or password';
                        // vm.welcome = '';
                    }
                );
        }

        function activate() {
            var promises = [fetchProjects()];
            common.activateController(promises, controllerId)
                .then(function () { 
                    // log('Admin View'); 
                });
        }

        function openCalender1(){
            vm.calender1.opened = !vm.calender1.opened;
        }

        function openCalender2(){
            vm.calender2.opened = !vm.calender2.opened;
        }

        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && (!(date.getDay() === 0 ) || (date > (new Date())));
        }

        var fetchForm = document.getElementById('dataFetchForm');
        fetchForm.addEventListener('keydown', function (e) {
            if (e.keyCode) {
                e.preventDefault();
            }
        }, true);

        function submit(){
            var submittedData = {
                startWeek : moment(vm.startWeek).format('MM/DD/YYYY'),
                endWeek : moment(vm.endWeek).format('MM/DD/YYYY'),
                projectId : vm.projectId
            };
            console.log(JSON.stringify(submittedData));
            if((new Date(vm.startWeek)) <= (new Date(vm.endWeek))){
                clarityOperationService.fetchData({projectId : vm.projectId})
                .then(
                    function (data) {
                        vm.fetchedData = [];
                        var fetData =data;
                        for(var i=0;i<fetData.length;i++){

                            if( ((new Date(fetData[i].WeekStartDate)) >= (new Date(vm.startWeek))) && ((new Date(fetData[i].WeekStartDate)) <= (new Date(vm.endWeek)))){
                                var singleRow = {};
                                singleRow.empId = fetData[i].AssociateId;
                                singleRow.name = fetData[i].FirstName;
                                singleRow.project = fetData[i].ProjectName;
                                singleRow.allocated = fetData[i].ExpectedHrs;
                                singleRow.actual = fetData[i].ActualHrs;
                                singleRow.Comments = fetData[i].Comments;
                                singleRow.WeekStartDate = fetData[i].WeekStartDate;
                                singleRow.hrsDiff = String(fetData[i].ExpectedHrs !== fetData[i].ActualHrs);

                                vm.fetchedData.push(singleRow);
                            }
                        }
                        if(vm.fetchedData.length > 0){
                            vm.showTable = true;
                        }else{
                            vm.showTable = false;
                            log('No Data to show');
                        }
                    },
                    function (data) {
                        // vm.error = 'Error: Invalid user or password';
                        // vm.welcome = '';
                    }
                );
            }else{
                log('End Week should be later or equal from start week');
            }

        }

        function downloadExcel(){
          var content = [];
          content.push(vm.table_headers);
          for (var i=0; i<vm.fetchedData.length; i++) {
            content.push([vm.fetchedData[i].empId,vm.fetchedData[i].name,vm.fetchedData[i].project,vm.fetchedData[i].WeekStartDate,vm.fetchedData[i].allocated,vm.fetchedData[i].actual,vm.fetchedData[i].Comments,vm.fetchedData[i].hrsDiff]);
          }
          if (content && angular.isArray(content)) {
                var finalVal = cleanUpCSVContent(content) ;
                downloadFile(finalVal, 'Exported_Table.CSV') ;
          }
        }
        

        function getFileType(fileName)  {
            var extension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName)[0] : 'No extension' ;
            var type = 'application/octet-stream';
            switch(extension.toLowerCase()) {
                case 'csv':
                    type = 'text/csv;charset=utf-8';
                    break;
            }
            return type ;
        }

        function cleanUpCSVContent(content) {
            var finalVal = '';
            for (var x = 0; x < content.length; x++) {
                    var value = content[x];

                    for (var y = 0; y < value.length; y++) {
                        var innerValue = value[y] || '';
                        var result;
                        if (typeof(innerValue) !== 'number') {
                            result = innerValue.replace(/"/g, '""');
                        } else {
                            result = innerValue;
                        }

                        if (typeof(result) !== 'number') {
                            if (result.search(/("|,|\n)/g) >= 0) {
                                result = '"' + result + '"';
                            }
                        } else {
                            result = '"' + result + '"';
                        }

                        if (y > 0) {
                            finalVal += ',';
                        }

                        finalVal += result;
                    }

                    finalVal += '\n';
                }
            return finalVal ;
        }

        function downloadFile(finalVal, fileName) {
            var fileType = getFileType(fileName) ;
            var csvUrl;
            if (window.navigator.msSaveOrOpenBlob)  {
                var blob = new Blob([finalVal], {
                    type: fileType + ';'
                });
                navigator.msSaveBlob(blob, fileName);
            }   else    {
                var anchor = document.createElement('a');


                if ('download' in anchor) {
                    var blob = new Blob([finalVal], {
                        type: fileType + ';'
                    });
                    csvUrl = URL.createObjectURL(blob);
                    anchor.setAttribute('download', fileName);
                } else {
                    csvUrl = 'data:' + fileType + ',' + encodeURIComponent(finalVal);
                    anchor.setAttribute('target', '_blank');
                }
                anchor.setAttribute('href', csvUrl);

                document.body.appendChild(anchor);

                setTimeout(function() {
                    if (anchor.click) {
                        anchor.click();
                    } else if (document.createEvent) {
                        var eventObj = document.createEvent('MouseEvents');
                        eventObj.initEvent('click', true, true);
                        anchor.dispatchEvent(eventObj);
                    }
                    document.body.removeChild(anchor);

                }, 100);

            }
        }

    }
})();