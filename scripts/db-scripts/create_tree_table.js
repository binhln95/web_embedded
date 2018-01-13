// create by BinhLN 15/11/2017
var mysql = require('mysql');
var dbconfig = require('../../config/database');
var con = mysql.createConnection(dbconfig.connection);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a table named "customers":*/
  var sql = '\
    CREATE TABLE `tree` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `name` VARCHAR(50) NOT NULL, \
    `humimax` VARCHAR(10), \
    `humimin` VARCHAR(10), \
    `humi` VARCHAR(10), \
    `time_create` Date NOT NULL, \
     PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)';
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    con.end();
  });

});

// con.end();