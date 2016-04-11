-- a. Info about user-specified movie
SELECT * FROM movie WHERE movie.name = input;

--b. Full list of actors

SELECT A.firstane, A.lastname FROM actor A, movie M, actorPlays P WHERE (M.name = input AND M.movieID = P.movieID); 
