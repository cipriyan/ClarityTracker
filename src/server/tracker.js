
    var promise = require('bluebird'),
        express = require('express'),
        config = require('./config'),
        clHelper = require('./helper'),
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
        return db.one(clHelper.sqlPath('data/userQry.sql'), {associateId : associateId})
            .then(function (data) {
                return data;
            })
            .catch(function (err) {
                if (err instanceof pgp.errors.QueryFileError) {
                    // => the error is related to our QueryFile
                    console.log('err', err);
                }
                return err;
            })
            .finally(function () {
                pgp.end();
            });
    }

    function getAllClTrackers(req, res, next) {
        var startDate = req.params.startDate;
        db.any('select * from ClTrackerReq')
            .then(function (data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved ALL Cl Tracker Req'
                    });
            })
            .catch(function (err) {
                return next(err);
            })
            .finally(function () {
                pgp.end();
            });
    }

    function getClTracker(req, res, next) {
        var pupID = parseInt(req.params.id);
        db.one('select * from ClTrackerReq where id = $1', pupID)
            .then(function (data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved Cl Tracker Req'
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }

    function createClTracker(req, res, next) {
        req.body.age = parseInt(req.body.age);
        db.none('insert into ClTrackerReq(name, breed, age, sex)' +
                'values(${name}, ${breed}, ${age}, ${sex})',
                req.body)
            .then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Inserted one puppy'
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }

    function updateClTracker(req, res, next) {
        db.none('update ClTrackerReq set name=$1, breed=$2, age=$3, sex=$4 where id=$5', [req.body.name, req.body.breed, parseInt(req.body.age),
                req.body.sex, parseInt(req.params.id)
            ])
            .then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Updated ClTracker'
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }

    function removeClTracker(req, res, next) {
        var clTrackerId = parseInt(req.params.id);
        db.result('delete from ClTrackerReq where id = $1', clTrackerId)
            .then(function (result) {
                /* jshint ignore:start */
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Removed ${result.rowCount} ClTracker'
                    });
                /* jshint ignore:end */
            })
            .catch(function (err) {
                return next(err);
            });
    }


    var tracker = {
        getUserProfile: getUserProfile,
        getAllClTrackers: getAllClTrackers,
        getClTracker: getClTracker,
        createClTracker: createClTracker,
        updateClTracker: updateClTracker,
        removeClTracker: removeClTracker
    };
module.exports = tracker;
