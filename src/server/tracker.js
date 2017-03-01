
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

    // function getUserProfile (associateId) {
    //     return db.one(clHelper.sqlPath('data/userQry.sql'), {associateId : associateId})
    //         .then(function (data) {
    //             return data;
    //         })
    //         .catch(function (err) {
    //             if (err instanceof pgp.errors.QueryFileError) {
    //                 // => the error is related to our QueryFile
    //                 console.log('err', err);
    //             }
    //             return err;
    //         })
    //         .finally(function () {
    //             pgp.end();
    //         });
    // }

    function getUserProfile (associateId) {
        return db.one('SELECT "User"."AssociateId","User"."FirstName","User"."LastName","User"."Email","User"."IsMgr","User"."IsAdmin","User"."IsSuperAdmin","User"."IsActive","Team"."ProjectName","UserTeam"."Id" FROM public."Team",public."User",public."UserTeam" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "User"."AssociateId" = ${associateId};', {associateId : associateId})
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

    // function getAllClTrackers(req, res, next) {
    //     var startDate = req.params.startDate;
    //     db.any('select * from ClTrackerReq')
    //         .then(function (data) {
    //             res.status(200)
    //                 .json({
    //                     status: 'success',
    //                     data: data,
    //                     message: 'Retrieved ALL Cl Tracker Req'
    //                 });
    //         })
    //         .catch(function (err) {
    //             return next(err);
    //         })
    //         .finally(function () {
    //             //pgp.end();
    //         });
    // }

    function getEnteredDate(req, res, next) {
        return db.one('SELECT * FROM public."ClTrackerReq" WHERE "WeekStartDate" = ${weekOfYear} AND "UserTeamId" = ${UserTeamId};',
                req)
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


    function getProject(req, res, next) {
        return db.one('SELECT * FROM public."Team",public."UserTeam" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "UserTeam"."Id" = ${UserTeamId};',
                req)
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

    function enterTimeSheet(req, res, next) {
        return db.one('INSERT INTO public."ClTrackerReq"("WeekStartDate","ExpectedHrs","ActualHrs","Comments","IsActive","UserTeamId") VALUES (${WeekStartDate},${ExpectedHrs},${ActualHrs},${Comments},${IsActive},${UserTeamId});',
                req)
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
        getProject: getProject,
        getEnteredDate: getEnteredDate,
        enterTimeSheet: enterTimeSheet,
        updateClTracker: updateClTracker,
        removeClTracker: removeClTracker
    };
module.exports = tracker;
