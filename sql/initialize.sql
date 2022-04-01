CREATE TABLE ACCOUNTS (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(50) NOT NULL UNIQUE, 
 password TEXT NOT NULL, 
 type ENUM("hospital","driver") NOT NULL
);

CREATE TABLE HOSPITALS (
 id INT NOT NULL UNIQUE REFERENCES ACCOUNTS(id), 
 name TEXT NOT NULL, 
 place_id TEXT NOT NULL,
 loc_lat DOUBLE NOT NULL,
 loc_lng DOUBLE NOT NULL
);

CREATE TABLE DRIVERS (
 id INT NOT NULL UNIQUE REFERENCES ACCOUNTS(id), 
 hospital_id INT NOT NULL REFERENCES HOSPITALS(id),
 name TEXT NOT NULL, 
 phone CHAR(10) NOT NULL UNIQUE,
 loc_lat DOUBLE,
 loc_lng DOUBLE
);

CREATE TABLE REQUEST_STATUS (
 id INT AUTO_INCREMENT PRIMARY KEY,
 hospital_id INT NOT NULL REFERENCES HOSPITALS(id),
 driver_id INT REFERENCES DRIVERS(id),
 status ENUM("pending","approved","arriving","returning","hospitalized"),
 brought_by ENUM("helping_person","driver") NOT NULL,
 location_lat DOUBLE NOT NULL,
 location_lng DOUBLE NOT NULL,
 dev_id VARCHAR(20) NOT NULL
);

-- CREATE TABLE PATIENT(
--  id INT AUTO_INCREMENT PRIMARY KEY,
--  hospital_id INT NOT NULL REFERENCES HOSPITALS(id),
--  brought_by ENUM("hospital","driver"),
--  driver_id INT REFERENCES DRIVERS(id),
--  phone CHAR(10) NOT NULL UNIQUE,
--  name TEXT NOT NULL,
--  relative_phone TEXT,
--  help_person_phone CHAR(10)
-- );

-- CREATE TABLE HELP_PERSONS(
--  name TEXT NOT NULL,
--  phone CHAR(10) NOT NULL UNIQUE,
--  patient_id CHAR(10) NOT NULL REFERENCES 
-- );

