SELECT 
  "User"."AssociateId", 
  "User"."FirstName", 
  "User"."LastName", 
  "User"."Email", 
  "User"."IsMgr", 
  "User"."IsAdmin", 
  "User"."IsSuperAdmin", 
  "User"."IsActive", 
  "Team"."ProjectName",
  "UserTeam"."Id" as "UserTeamId"
FROM 
  public."Team", 
  public."User", 
  public."UserTeam"
WHERE 
  "Team"."Id" = "UserTeam"."TeamId" AND
  "User"."Id" = "UserTeam"."UserId" AND 
  "UserTeam"."IsActive" = true AND
  "User"."AssociateId" = ${associateId};