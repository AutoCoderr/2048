DROP TABLE IF EXISTS datas;

CREATE TABLE datas (
    id int NOT NULL AUTO_INCREMENT,
    batch_x MEDIUMTEXT/*(180000)*/ NOT NULL,
    batch_y MEDIUMTEXT/*(55000)*/ NOT NULL,
    user enum("julien","jacques","eric") NOT NULL,
    PRIMARY KEY (id)
);