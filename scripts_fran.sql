CREATE TABLE Actor(
    ActorID = INTEGER,
    lastname = VARCHAR(20),
    firstname = VARCHAR(20),
    DateOfBirth = DATE,
    country = VARCHAR(20),
    Bio = VARCHAR,
    PRIMARY KEY(ActorID));

CREATE TABLE Role(
    RoleID = INTEGER,
    name = VARCHAR(20),
    ActorID = INTEGER,
    PRIMARY KEY(RoleID),
    FOREIGN KEY(ActorID) REFERENCE Actor);

CREATE TABLE ActorPlays(
    MovieID = INTEGER,
    ActorID = INTEGER,
    PRIMARY KEY(MovieID),
    FOREIGN KEY(ActorID) REFERENCE ACTOR);

CREATE TABLE Director(
    DirectorID = INTEGER,
    lastname = VARCHAR(20),
    firstame = VARCHAR(20),
    DateOfBirth = DATE,
    country = VARCHAR(20),
    PRIMARY KEY(DirectorID));

CREATE TABLE Directs(
    DirectorID = INTEGER,
    MovieID = INTEGER,
    PRIMARY KEY(DirectorID),
    FOREIGN KEY(MovieID) REFERENCE Movie);

CREATE TABLE Studio(
    StudioID = INTEGER,
    name = VARCHAR(20),
    country = VARCHAR(20),
    PRIMARY KEY(StudioID));

CREATE TABLE Sponsors(
    StudioID = INTEGER,
    MovieID = INTEGER,
    PRIMARY KEY(StudioID),
    FOREIGN KEY(MovieID) REFERENCE Movie);
