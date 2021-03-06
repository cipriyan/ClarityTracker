﻿-- Database: "ClarityTracker"

-- DROP DATABASE "ClarityTracker";
-- CREATE DATABASE "ClarityTracker"
--   WITH OWNER = postgres
--        ENCODING = 'UTF8'
--        TABLESPACE = pg_default
--        LC_COLLATE = 'English_United States.1252'
--        LC_CTYPE = 'English_United States.1252'
--        CONNECTION LIMIT = -1;
-- 
-- COMMENT ON DATABASE "ClarityTracker"
--   IS 'Clarity Tracker';
CREATE SEQUENCE "User_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE "User_id_seq"
  OWNER TO postgres;

CREATE TABLE "User"
(
  "Id" integer NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
  "AssociateId" integer NOT NULL,
  "FirstName" character varying NOT NULL,
  "LastName" character varying NOT NULL,
  "Email" character varying,
  "IsMgr" boolean,
  "IsAdmin" boolean,
  "IsSuperAdmin" boolean,
  "IsActive" boolean,
  CONSTRAINT "User_pkey" PRIMARY KEY ("Id"),
  CONSTRAINT "AssociateId_unique" UNIQUE ("AssociateId")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "User"
  OWNER TO postgres;

CREATE SEQUENCE "Team_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE "Team_id_seq"
  OWNER TO postgres;

CREATE TABLE "Team"
(
  "Id" integer NOT NULL DEFAULT nextval('"Team_id_seq"'::regclass),
  "ProjectName" character varying NOT NULL,
  "Description" character varying,
  "IsActive" boolean,
  "MgrId" integer NOT NULL,
  CONSTRAINT "Team_pkey" PRIMARY KEY ("Id"),
  CONSTRAINT "user" FOREIGN KEY ("MgrId")
      REFERENCES "User" ("Id") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Team"
  OWNER TO postgres;

-- Index: fki_user_fkey

-- DROP INDEX fki_user_fkey;

CREATE INDEX fki_user_fkey
  ON "Team"
  USING btree
("MgrId");


CREATE SEQUENCE "UserTeam_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE "UserTeam_id_seq"
  OWNER TO postgres;

CREATE TABLE "UserTeam"
(
  "Id" integer NOT NULL DEFAULT nextval('"UserTeam_id_seq"'::regclass),
  "IsActive" boolean,
  "UserId" integer NOT NULL,
  "TeamId" integer NOT NULL,
  CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("Id"),
  CONSTRAINT team FOREIGN KEY ("TeamId")
      REFERENCES "Team" ("Id") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "user" FOREIGN KEY ("UserId")
      REFERENCES "User" ("Id") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "UserTeam"
  OWNER TO postgres;

-- Index: fki_team

-- DROP INDEX fki_team;

CREATE INDEX fki_team
  ON "UserTeam"
  USING btree
  ("TeamId");

-- Index: fki_user

-- DROP INDEX fki_user;

CREATE INDEX fki_user
  ON "UserTeam"
  USING btree
  ("UserId");

CREATE SEQUENCE "ClTrackerReq_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE "ClTrackerReq_id_seq"
  OWNER TO postgres;
  
CREATE TABLE "ClTrackerReq"
(
  "Id" integer NOT NULL DEFAULT nextval('"ClTrackerReq_id_seq"'::regclass),
  "WeekStartDate" character varying NOT NULL,
  "ExpectedHrs" integer NOT NULL,
  "ActualHrs" integer NOT NULL,
  "Comments" character varying,
  "IsActive" boolean,
  "UserTeamId" integer NOT NULL,
  CONSTRAINT "ClTrackerReq_pkey" PRIMARY KEY ("Id"),
  CONSTRAINT "UserTeamId" FOREIGN KEY ("UserTeamId")
      REFERENCES "UserTeam" ("Id") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "ClTrackerReq"
  OWNER TO postgres;

-- Index: "fki_User"

-- DROP INDEX "fki_User";

CREATE INDEX "fki_User"
  ON "ClTrackerReq"
  USING btree
  ("UserId");

-- Index: "fki_user_ClTracker"

-- DROP INDEX "fki_user_ClTracker";

CREATE INDEX "fki_user_ClTracker"
  ON "ClTrackerReq"
  USING btree
  ("TeamId");