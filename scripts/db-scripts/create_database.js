/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('create database if not exists dahn;\n', function (err, result) {
    if (err) {
        console.log("-------- ERROR ------- \n", err);
    }
    else {
        console.log("Database '%s' Created\n", dbconfig.database, result);
    }
});
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)', function (err, result) {
    if (err) {
        console.log("-------- ERROR ------- \n", err);
    }
    else {
        console.log('Success: Table "%s" Created!', dbconfig.users_table);
    }
});

// connection.query('\')
connection.end();
