
    var promise = require('bluebird'),
        express = require('express'),
        config = require('./config'),
        clHelper = require('./helper'),
        cont = require('./constant');
        app = express();

        var options = {
            // Initialization Options
            promiseLib: promise
        };
    var pgp = require('pg-promise')(options);
    var connectionString = config.db.dev;

    var QueryFile = require('pg-promise').QueryFile;
    if (app.get('env') === 'production') {
        connectionString = config.db.prod;
    }
    var db = pgp(connectionString);        

    function getUserProfile (associateId) {
        return db.one(cont.getProfile, {associateId : associateId})
            .then(function (data) {
                return data;
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }    

    function getEnteredTimeSheet(req, res, next) {
        return db.any(cont.getEnteredEntry,req.body)
            .then(function (data) {
                res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved User Entered Data'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }

    function enterTimeSheet(req, res, next) {
        return db.none(cont.enterEntry,req.body)
            .then(function (data) {
                res.status(200)
                            .json({
                                status: 'success',
                                message: 'Data Entered Successfully'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }

    function updateTimeSheet(req, res, next) {
        return db.none(cont.updateEnteredEntry,req.body)
            .then(function (data) {
                res.status(200)
                            .json({
                                status: 'success',
                                message: 'Data Updated Successfully'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }

    function getProjects(req, res, next) {
        return db.any(cont.getProjects)
            .then(function (data) {
                // console.log("data : ",data);
                res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved Projects Details'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }

    function getReportData(req, res, next) {
        if(req.body.projectId){
            return db.any(cont.getReportForSpeProj,req.body)
            .then(function (data) {
                res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved Report Details'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
        }else{
            return db.any(cont.getReportForAllProj)
            .then(function (data) {
                res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'Retrieved Report Details'
                            });
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
        }
        
    }


    var tracker = {
        getUserProfile: getUserProfile,
        getEnteredTimeSheet: getEnteredTimeSheet,
        enterTimeSheet: enterTimeSheet,
        getProjects: getProjects,
        getReportData: getReportData,
        updateTimeSheet: updateTimeSheet
    };
module.exports = tracker;
