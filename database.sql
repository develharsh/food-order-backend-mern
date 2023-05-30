set
    timezone = 'Asia/Kolkata';

create extension "uuid-ossp";

CREATE TYPE user_roles AS ENUM (
    'provider',
    'consumer',
    'delivery',
    'admin'
);

create table users (
    user_id uuid default uuid_generate_v4() unique,
    user_email varchar(40) not null,
    user_password text not null,
    user_name varchar(30) not null,
    user_role user_roles not null,
    user_open_for_order boolean,
    user_active_deliv_req uuid,
    primary key (user_id, user_email)
);

create table restraunts (
    rest_id uuid default uuid_generate_v4 () unique,
    rest_name varchar(40) not null,
    rest_operator uuid not null,
    rest_is_verified boolean default false,
    rest_open_for_order boolean default false,
    rest_address text not null,
    constraint fk_rest_operator foreign key(rest_operator) references users(user_id),
    primary key (rest_id)
);

create table dishes (
    dish_id uuid default uuid_generate_v4 () unique,
    dish_title varchar(70) not null,
    dish_image text not null,
    dish_is_active boolean default true,
    dish_price numeric(9, 2) not null,
    dish_provider uuid not null,
    constraint fk_dish_provider foreign key(dish_provider) references restraunts(rest_id),
    primary key (dish_id)
);

CREATE TYPE address_types AS ENUM (
    'Home',
    'Business',
    'Office',
    'Other'
);

create table addresses (
    addr_id uuid default uuid_generate_v4 () unique,
    addr_of_user uuid not null,
    addr_details text not null,
    addr_pincode varchar(6) not null,
    addr_type address_types not null,
    addr_is_primary boolean not null,
    constraint fk_addr_of_user foreign key(addr_of_user) references users(user_id),
    primary key (addr_id)
);

CREATE TYPE order_statuses AS ENUM (
    'Initiated',
    'Food is being Prepared',
    'Sent from Restraunt',
    'Delivered'
);

CREATE TYPE delivery_req_statuses AS ENUM (
    'Initiated',
    'Assigned',
    'Going',
    'Waiting',
    'Coming',
    'Reached',
    'Delivered'
);

CREATE TYPE restraunt_req_statuses AS ENUM (
    'Initiated',
    'Food is being Prepared',
    'Sent from Restraunt'
);

create table orders (
    order_id uuid default uuid_generate_v4 () unique,
    order_consumer uuid not null,
    order_dish_id uuid not null,
    order_quantity int not null,
    order_rest_id uuid not null,
    order_delivery uuid not null,
    order_addr_id uuid not null,
    order_status order_statuses not null,
    order_delivery_status delivery_req_statuses not null,
    created_at timestamp not null default current_timestamp,
    constraint fk_order_consumer foreign key(order_consumer) references users(user_id),
    constraint fk_order_dish_id foreign key(order_dish_id) references dishes(dish_id),
    constraint fk_order_rest_id foreign key(order_rest_id) references restraunts(rest_id),
    constraint fk_order_delivery foreign key(order_delivery) references users(user_id),
    constraint fk_order_addr_id foreign key(order_addr_id) references addresses(addr_id),
    primary key (order_id)
);

create table deliveryrequests (
    deliv_req_id uuid default uuid_generate_v4 () unique,
    deliv_req_consumer_id uuid not null,
    deliv_req_order_id uuid not null,
    deliv_req_status delivery_req_statuses not null,
    created_at timestamp not null default current_timestamp,
    constraint fk_deliv_req_consumer_id foreign key(deliv_req_consumer_id) references users(user_id),
    constraint fk_deliv_req_order_id foreign key(deliv_req_order_id) references orders(order_id),
    primary key (deliv_req_id)
);

create table restrauntrequests (
    rest_req_id uuid default uuid_generate_v4 () unique,
    rest_req_order_id uuid not null,
    rest_req_status restraunt_req_statuses not null,
    created_at timestamp not null default current_timestamp,
    constraint fk_rest_req_order_id foreign key(rest_req_order_id) references orders(order_id),
    primary key (rest_req_id)
);