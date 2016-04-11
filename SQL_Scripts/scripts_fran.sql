CREATE TABLE Actor(
    ActorID SERIAL PRIMARY KEY,
    lastname VARCHAR(255),
    firstname VARCHAR(255));

CREATE TABLE Role(
    RoleID SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ActorID INTEGER,
    FOREIGN KEY(ActorID) REFERENCES Actor ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE ActorPlays(
    MovieID INTEGER,
    ActorID INTEGER,
    FOREIGN KEY(MovieID) REFERENCES movie ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(ActorID) REFERENCES Actor ON DELETE CASCADE ON UPDATE CASCADE, 
    PRIMARY KEY(MovieID, ActorID));

CREATE TABLE Director(
    DirectorID SERIAL PRIMARY KEY,
    lastname VARCHAR(255),
    firstname VARCHAR(255)
    );

CREATE TABLE Directs(
    DirectorID INTEGER,
    MovieID INTEGER,
    FOREIGN KEY(DirectorID) REFERENCES Director ON UPDATE CASCADE ON DELETE CASCADE, 
    FOREIGN KEY(MovieID) REFERENCES movie ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(directorid, movieid));

CREATE TABLE Studio(
    StudioID SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255));

CREATE TABLE Sponsors(
    StudioID INTEGER,
    MovieID INTEGER,
    FOREIGN KEY(StudioID) REFERENCES Studio ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(MovieID) REFERENCES Movie ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(studioid, movieid));
