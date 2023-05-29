set
    timezone = 'Asia/Kolkata';

create extension "uuid-ossp";

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 (),
    email VARCHAR(40) NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id, email)
);