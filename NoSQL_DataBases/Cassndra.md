   1.CREATE KEYSPACE cassandra1
              WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

..#PAGING OFF

#TRACING ON

.use cassandra1;

....

-------------------------------------------------------------------------------------------------

-----------------

1.

 CREATE TABLE d1 (title_album text,track_id int,title_track text,PRIMARY KEY(title_album,track_id));



describe d1

COPY d1 FROM 'D:\master\bigdata\tamrin2\csv\d1.csv' WITH DELIMITER=',' AND HEADER=TRUE;

#SELECT * FROM d1 WHERE title_album='Rumble, Young Man, Rumble';

SELECT track_id,title_track FROM d1 WHERE title_album='Rumble, Young Man, Rumble';

--------------------------

-------------------------------------------------------------------------

 2.

CREATE TABLE d2 (artist text ,genre text,track_id int,title_track text,PRIMARY KEY((artist,genre),track_id));

COPY d2 FROM 'D:\master\bigdata\tamrin2\csv\d2.csv' WITH DELIMITER=',' AND HEADER=TRUE;

SELECT track_id,title_track,genre FROM d2 WHERE artist='RoccoW' AND genre='Null';



#CREATE TABLE d2 (artist text ,genre text,title_track text,track_id int,PRIMARY KEY((artist,genre),track_id));(is false)

note: چون کلاسترت براساس ای دیه..هرچی که وسه کلاستز اول میاد باید بعد پارتیشن کیا باشه. ینی بلافاصله

-----------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------------------

3.

CREATE TABLE d3 (genre text ,year int,duration int,track_id int,title_track text,PRIMARY  KEY((genre,year),duration,track_id));

 COPY d3 FROM 'D:\master\bigdata\tamrin2\csv\d3.csv' WITH DELIMITER=',' AND HEADER=TRUE;

#DROP TABLE d3;

 SELECT title_track,duration FROM d3 WHERE genre='Hip-Hop' AND duration<180 AND year in(2015,2016);

-------------------------------------------------

------------------------------------------

4.

 CREATE TABLE  d4 (genre text,month int ,listens_track int,track_id int,title_track text,PRIMARY KEY((genre,month),listens_track,track_id));

 COPY d4 FROM 'D:\master\bigdata\tamrin2\csv\d4.csv' WITH DELIMITER=',' AND HEADER=TRUE;

SELECT title_track,listens_track FROM d4 WHERE month=4 AND listens_track>300 and genre in('Electronic','Pop') ;

----------------
5.there is n't any question
--------------------------

6.

CREATE TABLE d6 (year int,genre text ,month int,track_id int,PRIMARY KEY((year,genre),month,track_id));

COPY d6 FROM 'D:\master\bigdata\tamrin2\csv\d6.csv' WITH DELIMITER=',' AND HEADER=TRUE;

 SELECT genre,COUNT(track_id) as COUNT FROM d6 WHERE genre in('Folk') AND month<=6 AND year=2008 ;

------------------

-----------------------------------

### 

7.

CREATE TABLE d7 (genre text ,duration int,track_id int ,title_track text,PRIMARY KEY(genre,duration,track_id)) ;

 COPY d7 FROM 'D:\master\bigdata\tamrin2\csv\d7.csv' WITH DELIMITER=',' AND HEADER=TRUE;

7.1.

SELECT AVG(duration) AS avg_minute FROM d7  where genre in('Pop','others','Blues','Classical','Country'

,'Easy Listening','Electronic','Experimental','Folk','Hip-Hop','Instrumental','International',

'Jazz','Old-Time  /  Historic','Rock','Soul-RnB','Spoken')  ;

7.2.

SELECT title_track,duration FROM  d7 where genre in('Pop','others','Blues','Classical','Country'

,'Easy Listening','Electronic','Experimental','Folk','Hip-Hop','Instrumental','International',

'Jazz','Old-Time  /  Historic','Rock','Soul-RnB','Spoken') order by duration desc

 limit 10  ;                          

-----------

--------



8.

CREATE TABLE d8 (year int,genre text,favorites_album int,title_album text,favorites_artist int,PRIMARY KEY((year ,genre),favorites_album,title_album)) WITH CLUSTERING ORDER BY (favorites_album DESC);



 COPY d8 FROM 'D:\master\bigdata\tamrin2\csv\d8.csv' WITH DELIMITER=',' AND HEADER=TRUE;



SELECT * FROM d8 WHERE genre in ('Rock') AND year in(2016) order by favorites_album desc limit 10 ;

-------

----------------------



9.

CREATE TABLE d9 (genre text,listens_track int,track_id int,day int,PRIMARY KEY(genre,listens_track,track_id ));

 COPY d9 FROM 'D:\master\bigdata\tamrin2\csv\d9.csv' WITH DELIMITER=',' AND HEADER=TRUE;



CAPTURE 'D:\master\bigdata\tamrin2\csv\d9_1.csv';

select day,track_id,genre,sum(listens_track) as sum_ from d9 group by genre;

CAPTURE  off

CREATE TABLE d9_2 (day int,sum_ int,track_id int ,genre text,PRIMARY KEY(day,sum_,track_id));

 COPY d9_2 FROM 'D:\master\bigdata\tamrin2\csv\d9_2.csv' WITH DELIMITER=',' AND HEADER=TRUE;

select genre,sum_ from d9_2 where day in(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19

,20,21,22,23,24,25,26,27,28,29,30,31) order by sum_ desc;

---------

---------------



10.

CREATE TABLE d10 (year int,listens_album int,track_id int,artist text,PRIMARY KEY(year,listens_album,track_id)) WITH CLUSTERING ORDER BY (listens_album DESC);

```
 COPY d10 FROM 'D:\master\bigdata\tamrin2\csv\d10.csv' WITH DELIMITER=',' AND HEADER=TRUE;


```

 select year,artist,max(listens_album) as max_ from d10 where year in(2015,2016,2017) group by year ;

