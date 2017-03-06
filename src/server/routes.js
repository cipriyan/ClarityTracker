(function(routes){
    var app;
    //var jsonfileservice = require('./jsonfileservice.js');
    var pkg = require('./package.json');
    var apiPath = pkg.paths.api;
    var dataPath = pkg.paths.data;
    var trackerService = require('./tracker');

    routes.init = init;

    function init(_app_){
        app = _app_;
        configureRoutes();
    }

    function configureRoutes(){
        //app.get(apiPath + '/maa', getMaa);
        //app.post(apiPath + '/clarityTrack', clarityTrack);

        app.post(apiPath + '/timeEntry', trackerService.enterTimeSheet);
        app.post(apiPath + '/fetchTimeEntry', trackerService.getEnteredTimeSheet);
        app.post(apiPath + '/updateTimeEntry', trackerService.updateTimeSheet);
        app.post(apiPath + '/fetchProjects', trackerService.getProjects);
        app.post(apiPath + '/fetchData', trackerService.getReportData);
    }

    function clarityTrack (argument) {
        // body...
        //update to DB
    }


})(module.exports);
