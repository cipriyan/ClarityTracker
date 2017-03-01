
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

    function getEnteredTimeSheet(req, res, next) {
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

    function getProjects(req, res, next) {
        return db.any('SELECT "Team"."ProjectName" FROM public."Team";')
            .then(function (data) {
                // console.log("data : ",data);
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

    function getReportData(req, res, next) {
        if(req.projectId){
            return db.any('SELECT "User"."AssociateId","User"."FirstName","Team"."ProjectName","ClTrackerReq"."ExpectedHrs","ClTrackerReq"."ActualHrs","ClTrackerReq"."WeekStartDate","ClTrackerReq"."Comments" FROM public."Team",public."User",public."UserTeam",public."ClTrackerReq" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "ClTrackerReq"."UserTeamId" = "UserTeam"."Id" AND "Team"."ProjectName" = ${projectId};',req)
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
        }else{
            return db.any('SELECT "User"."AssociateId","User"."FirstName","Team"."ProjectName","ClTrackerReq"."ExpectedHrs","ClTrackerReq"."ActualHrs","ClTrackerReq"."WeekStartDate","ClTrackerReq"."Comments" FROM public."Team",public."User",public."UserTeam",public."ClTrackerReq" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "ClTrackerReq"."UserTeamId" = "UserTeam"."Id";')
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
        
    }


    var tracker = {
        getUserProfile: getUserProfile,
        getEnteredTimeSheet: getEnteredTimeSheet,
        enterTimeSheet: enterTimeSheet,
        getProjects: getProjects,
        getReportData: getReportData
    };
module.exports = tracker;
