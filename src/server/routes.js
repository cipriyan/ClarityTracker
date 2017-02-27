(function(routes){
    var app;
    //var jsonfileservice = require('./jsonfileservice.js');
    var pkg = require('./../../package.json');
    var apiPath = pkg.paths.api;
    var dataPath = pkg.paths.data;
    //var trackerService = require('../queries');

    routes.init = init;

    function init(_app_){
        app = _app_;
        configureRoutes();
    }

    function configureRoutes(){
        //app.get(apiPath + '/maa', getMaa);
        //app.post(apiPath + '/clarityTrack', clarityTrack);

        // router.get('/api/puppies', trackerService.getAllPuppies);
        // router.get('/api/puppies/:id', trackerService.getSinglePuppy);
        // router.post('/api/puppies', trackerService.createPuppy);
        // router.put('/api/puppies/:id', trackerService.updatePuppy);
        // router.delete('/api/puppies/:id', trackerService.removePuppy);
    }

    function clarityTrack (argument) {
        // body...
        //update to DB
    }
})(module.exports);
