(function(auth){
    var expressJwt  = require('express-jwt'),
        jwt         = require('jsonwebtoken'),
        pkg         = require('./package.json');

    var app;
    var apiPath = pkg.paths.api;
    var secret = 'this is the secret secret secret 12356';
    var trackerService = require('./tracker');

    auth.init = init;

    function init(_app_){
        app = _app_;
        app.use(apiPath, expressJwt({secret: secret})); // We are going to protect /api routes with JWT
        handleUnauth();
        configureRoutes();
    }

    function configureRoutes(){
        app.get(apiPath + '/restricted', pingRestricted);
        app.post('/authenticate', postAuth);
        app.post(apiPath + '/timeEntry', postTimeEntry);
        app.post(apiPath + '/fetchTimeEntry', postFetchTimeEntry);
        app.post(apiPath + '/updateTimeEntry', postUpdateTimeEntry);
        app.post(apiPath + '/fetchProjects', postFetchProjects);
        app.post(apiPath + '/fetchData', postFetchReportData);
    }

    function handleUnauth() {
        app.use(function (err, req, res, next) {
            if (err.constructor.name === 'UnauthorizedError') {
                res.send(401, 'Unauthorized');
            }
        });
    }

    function pingRestricted (req, res, next) {
        console.log('user ' + req.username + ' is calling /api/restricted');
        res.json({
            name: 'ping restricted api'
        });
    }

    function postAuth (req, res, next) {
        //TODO validate req.body.username and req.body.password
        //if is invalid, return 401
        if (!req.body.username) {
            res.status(401).send('Associate Id Missing');
            return;
        }
        trackerService.getUserProfile(req.body.username)
            .then(function (data) {
                console.log('getUserProfile', data);
                if(data.FirstName){
                    // We are sending the profile inside the token
                    var profile = { 'firstName' : data.FirstName, 'lastName' : data.LastName };
                    var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
                    res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved User profile',
                                token: token
                            });
                } else {
                    res.status(404).send('Associate Id does not exists');
                }
                
            })
            .catch(function (err) {
                    return next(err);
            });
    }


    function postTimeEntry (req, res, next) {
        trackerService.enterTimeSheet(req.body).then(function (data) {
                res.status(200)
                        .json({
                                status: 'success',
                                message: 'Data Entered Successfully'
                        });                
            })
            .catch(function (err) {
                    return next(err);
            });
    }

    function postUpdateTimeEntry (req, res, next) {
        trackerService.updateTimeSheet(req.body).then(function (data) {
                res.status(200)
                        .json({
                                status: 'success',
                                message: 'Data Updated Successfully'
                        });                
            })
            .catch(function (err) {
                    return next(err);
            });
    }


    function postFetchTimeEntry (req, res, next) {
        trackerService.getEnteredTimeSheet(req.body)
            .then(function (data) {
                    res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved User Entered Data'
                            });
                
            })
            .catch(function (err) {
                    return next(err);
            });
    }


    function postFetchProjects (req, res, next) {
        trackerService.getProjects(req.body)
            .then(function (data) {
                    res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved Projects Details'
                            });
                
            })
            .catch(function (err) {
                    return next(err);
            });
    }
    function postFetchReportData (req, res, next) {
        trackerService.getReportData(req.body)
            .then(function (data) {
                    res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved Projects Details'
                            });
                
            })
            .catch(function (err) {
                    return next(err);
            });
    }

})(module.exports);
