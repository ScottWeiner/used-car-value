--DROP TABLE IF EXISTS make
--DROP TABLE IF EXISTS model

CREATE TABLE make (
    id integer primary key,
    name VARCHAR(50)
)

CREATE TABLE model (
    id integer primary key,
    name CHAR(50),
    make_id integer 
    CONSTRAINT fk_make
        FOREIGN KEY (make_id)
            REFERENCES make(id)
)

INSERT INTO make (name)
values ('Ford'), ('Chevrolet'), ('Volvo'), ('Hyundai')

INSERT into model (name, make_id)
values ('XC60', 3), ('XC40', 3), ('Taurus', 1), ('Silverado' , 2), ('Sonata', 4)