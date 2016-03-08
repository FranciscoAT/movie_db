CEATE TABLE Actor(
    ActorID = INTEGER NOT NULL,
    lastname = VARCHAR(20),
    firstname = VARCHAR(20),
    DateOfBirth = DATE,
    country = VARCHAR(20),
    Bio = VARCHAR,
    PRIMARY KEY(ActorID));

CREATE TABLE Role(
    RoleID = INTEGER NOT NULL,
    name = VARCHAR(20) NOT NULL,
    ActorID = INTEGER NOT NULL,
    PRIMARY KEY(RoleID),
    FOREIGN KEY(ActorID) REFERENCE Actor ON DELETE RESTRICT);

CREATE TABLE ActorPlays(
    ActorPlaysID = INTEGER NOT NULL,
    MovieID = INTEGER NOT NULL,
    ActorID = INTEGER NOT NULL,
    PRIMARY KEY(ActorPlaysID),
    FOREIGN KEY(MovieID) REFERENCE MOVIE ON DELETE RESTRICT,
    FOREIGN KEY(ActorID) REFERENCE ACTOR ON DELETE RESTRICT);

CREATE TABLE Director(
    DirectorID = INTEGER NOT NULL,
    lastname = VARCHAR(20),
    firstame = VARCHAR(20),
    DateOfBirth = DATE,
    country = VARCHAR(20),
    PRIMARY KEY(DirectorID));

CREATE TABLE Directs(
    DirectsID = INTEGER NOT NULL,
    DirectorID = INTEGER NOT NULL,
    MovieID = INTEGER NOT NULL,
    PRIMARY KEY(DirectsID),
    FOREIGN KEY(DirectorID) REFERENCE Director ON UPDATE RESTRICT, 
    FOREIGN KEY(MovieID) REFERENCE Movie ON UPDATE RESTRICT);

CREATE TABLE Studio(
    StudioID = INTEGER NOT NULL,
    name = VARCHAR(20),
    country = VARCHAR(20),
    PRIMARY KEY(StudioID));

CREATE TABLE Sponsors(
    SponsorID = INTEGER NOT NULL,
    StudioID = INTEGER NOT NULL,
    MovieID = INTEGER NOT NULL,
    PRIMARY KEY(SponsorID),
    FOREIGN KEY(StudioID) REFERENCE Studio ON UPDATE RESTRICT,
    FOREIGN KEY(MovieID) REFERENCE Movie, ON UPDATE RESTRICT);