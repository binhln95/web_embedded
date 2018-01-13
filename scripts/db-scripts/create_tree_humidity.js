// create by BinhLN 15/11/2017
var mysql = require('mysql');
var dbconfig = require('../../config/database');
var con = mysql.createConnection(dbconfig.connection);

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    /*Create a table named "customers":*/
    var sql = "drop table if EXISTS tree_humidity;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Drop if exists table");
    });
    sql = "CREATE TABLE tree_humidity (\n" +
            "id INT UNSIGNED NOT NULL AUTO_INCREMENT,\n" +
            "tree_id int(10),\n" +
            "device_id int,\n" +
            "start_date Datetime,\n" +
            "value int,\n" +
            "PRIMARY KEY (id)\n" +
        ");";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        con.end();
    });

});

// con.end();