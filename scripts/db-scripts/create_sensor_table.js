// create by BinhLN 15/11/2017
var mysql = require('mysql');
var dbconfig = require('../../config/database');
var con = mysql.createConnection(dbconfig.connection);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a table named "customers":*/
  var sql = '\
  CREATE TABLE `sensor` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `id_tree` INT NOT NULL, \
    `name_sensor` VARCHAR(20) NOT NULL, \
    `value` INT NOT NULL, \
    `unit` VARCHAR(20) NOT NULL, \
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