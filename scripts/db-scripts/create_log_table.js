// create by BinhLN 15/11/2017
var mysql = require('mysql');
var dbconfig = require('../../config/database');
var con = mysql.createConnection(dbconfig.connection);

con.connect(function(err) {
  if (err) {
      console.log("----- ERROR -----\n", err);
  }
  else {
      /*Create a table named "customers":*/
      var sql = "drop table if EXISTS log;";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Drop table log if exist");
      });
      sql = '\
        CREATE TABLE `log` ( \
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
        `id_tree` INT NOT NULL, \
        `start_time` Datetime NOT NULL, \
        `end_time` Datetime NOT NULL, \
        `humi_start` INT, \
        `humi_end` INT, \
        PRIMARY KEY (`id`), \
        UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
      )';
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created");
          con.end();
      });
  }


});

// con.end();