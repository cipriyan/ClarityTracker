// var constant = {
// 	'getProfile' : 'SELECT "User"."AssociateId","User"."FirstName","User"."LastName","User"."Email","User"."IsMgr","User"."IsAdmin","User"."IsSuperAdmin","User"."IsActive","Team"."ProjectName","UserTeam"."Id" FROM public."Team",public."User",public."UserTeam" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "User"."AssociateId" = ${associateId};',
// 	'getEnteredEntry' : 'SELECT * FROM public."ClTrackerReq" WHERE "WeekStartDate" = ${weekOfYear} AND "UserTeamId" = ${UserTeamId};',
// 	'enterEntry' : 'INSERT INTO public."ClTrackerReq"("WeekStartDate","ExpectedHrs","ActualHrs","Comments","IsActive","UserTeamId") VALUES (${WeekStartDate},${ExpectedHrs},${ActualHrs},${Comments},${IsActive},${UserTeamId});',
// 	'updateEnteredEntry' : 'UPDATE public."ClTrackerReq" SET "WeekStartDate"=${WeekStartDate}, "ExpectedHrs"=${ExpectedHrs}, "ActualHrs"=${ActualHrs}, "Comments"=${Comments}, "IsActive"=${IsActive}, "UserTeamId"=${UserTeamId} WHERE "Id"=${Id};',
// 	'getProjects' : 'SELECT "Team"."ProjectName" FROM public."Team";',
// 	'getReportForSpeProj' : 'SELECT "User"."AssociateId","User"."FirstName","Team"."ProjectName","ClTrackerReq"."ExpectedHrs","ClTrackerReq"."ActualHrs","ClTrackerReq"."WeekStartDate","ClTrackerReq"."Comments" FROM public."Team",public."User",public."UserTeam",public."ClTrackerReq" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "ClTrackerReq"."UserTeamId" = "UserTeam"."Id" AND "Team"."ProjectName" = ${projectId};',
// 	'getReportForAllProj' : 'SELECT "User"."AssociateId","User"."FirstName","Team"."ProjectName","ClTrackerReq"."ExpectedHrs","ClTrackerReq"."ActualHrs","ClTrackerReq"."WeekStartDate","ClTrackerReq"."Comments" FROM public."Team",public."User",public."UserTeam",public."ClTrackerReq" WHERE "Team"."Id" = "UserTeam"."TeamId" AND "User"."Id" = "UserTeam"."UserId" AND "UserTeam"."IsActive" = true AND "ClTrackerReq"."UserTeamId" = "UserTeam"."Id";'
// }


// module.exports = constant;



var constant = {
	'getProfile' : 	 'SELECT'+
					 			'"User"."AssociateId",'+
					 			'"User"."FirstName",'+
					 			'"User"."LastName",'+
					 			'"User"."Email",'+
					 			'"User"."IsMgr",'+
					 			'"User"."IsAdmin",'+
					 			'"User"."IsSuperAdmin",'+
					 			'"User"."IsActive",'+
					 			'"Team"."ProjectName",'+
					 			'"UserTeam"."Id"'+
					 ' FROM'+
					 			' public."Team",'+
					 			'public."User",'+
					 			'public."UserTeam"'+
					 ' WHERE '+
					 			'"Team"."Id" = "UserTeam"."TeamId" AND'+
					 			' "User"."Id" = "UserTeam"."UserId" AND'+
					 			' "UserTeam"."IsActive" = true AND '+
					 			'"User"."AssociateId" = ${associateId};',

	'getEnteredEntry' : 'SELECT'+
									' * '+
						'FROM '+
									'public."ClTrackerReq" '+
						'WHERE '+
									'"WeekStartDate" = ${weekOfYear} AND '+
									'"UserTeamId" = ${UserTeamId};',

	'enterEntry' : 'INSERT INTO '+
									'public."ClTrackerReq"'+
										'('+
											'"WeekStartDate",'+
											'"ExpectedHrs",'+
											'"ActualHrs",'+
											'"Comments",'+
											'"IsActive",'+
											'"UserTeamId"'+
										')'+
									' VALUES '+
										'('+
											'${WeekStartDate},'+
											'${ExpectedHrs},'+
											'${ActualHrs},'+
											'${Comments},'+
											'${IsActive},'+
											'${UserTeamId}'+
										');',
	'updateEnteredEntry' : 'UPDATE '+
									'public."ClTrackerReq" '+
							'SET '+
									'"WeekStartDate"=${WeekStartDate}, '+
									'"ExpectedHrs"=${ExpectedHrs}, '+
									'"ActualHrs"=${ActualHrs}, '+
									'"Comments"=${Comments}, '+
									'"IsActive"=${IsActive}, '+
									'"UserTeamId"=${UserTeamId} '+
							'WHERE '+
									'"Id"=${Id};',
	'getProjects' : 'SELECT '+
							'"Team"."ProjectName" '+
					'FROM '+
							'public."Team"'+
					'WHERE'+
							'"Team"."IsActive"=true;',
	'getReportForSpeProj' : 'SELECT '+
									'"User"."AssociateId",'+
									'"User"."FirstName",'+
									'"Team"."ProjectName",'+
									'"ClTrackerReq"."ExpectedHrs",'+
									'"ClTrackerReq"."ActualHrs",'+
									'"ClTrackerReq"."WeekStartDate",'+
									'"ClTrackerReq"."Comments" '+
							'FROM '+
									'public."Team",'+
									'public."User",'+
									'public."UserTeam",'+
									'public."ClTrackerReq" '+
							'WHERE '+
									'"Team"."Id" = "UserTeam"."TeamId" AND '+
									'"User"."Id" = "UserTeam"."UserId" AND '+
									'"UserTeam"."IsActive" = true AND '+
									'"ClTrackerReq"."UserTeamId" = "UserTeam"."Id" AND '+
									'"Team"."ProjectName" = ${projectId};',
	'getReportForAllProj' : 'SELECT '+
									'"User"."AssociateId",'+
									'"User"."FirstName",'+
									'"Team"."ProjectName",'+
									'"ClTrackerReq"."ExpectedHrs",'+
									'"ClTrackerReq"."ActualHrs",'+
									'"ClTrackerReq"."WeekStartDate",'+
									'"ClTrackerReq"."Comments" '+
							'FROM '+
									'public."Team",'+
									'public."User",'+
									'public."UserTeam",'+
									'public."ClTrackerReq" '+
							'WHERE '+
									'"Team"."Id" = "UserTeam"."TeamId" AND '+
									'"User"."Id" = "UserTeam"."UserId" AND '+
									'"UserTeam"."IsActive" = true AND '+
									'"ClTrackerReq"."UserTeamId" = "UserTeam"."Id";'
}


module.exports = constant;
