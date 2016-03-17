var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('snakescores.db');

db.serialize(function () {
  db.run("DROP TABLE IF EXISTS score");

  db.run("CREATE TABLE score (value INTEGER, user TEXT, created_date TEXT);"); 
  db.run("INSERT INTO score (value, user, created_date) VALUES (?,?,?)",1430,"MIK",new Date());
  db.run("INSERT INTO score (value, user, created_date) VALUES (?,?,?)",990,"PSM",new Date());

  db.each("SELECT * FROM score", function (err, row) {
    console.log(row.value + "\n" + row.user + "\n" + row.created_date + "\n");
  });
});

db.close();