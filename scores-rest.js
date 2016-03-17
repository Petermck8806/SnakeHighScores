var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('snakescores.db');

var express = require('express');
var api = express();

var bodyParser = require('body-parser');
api.use(bodyParser.json());

//get all of the scores in the scores table.
api.get('/scores', function(req,res){
  db.all("SELECT * FROM score",function(err, rows){
    res.json(rows);
  });
});

//insert one score
api.post('/scores', function(req,res){
  var score = req.body; 

  db.run("INSERT INTO score (value, user, created_date) VALUES (?,?,?)",
    score.value, score.user, score.created_date); 

  res.status(202);
  res.end();
});

//post all of the scores. This will truncate the scores table and insert new scores.
api.post('/allscores', function(req, res){

  var scores = req.body;
  repopulateScores(scores);

  res.status(202);
  res.end();
});

function repopulateScores(scores){
  db.serialize(function (){
    db.run("DROP TABLE IF EXISTS score");
    db.run("CREATE TABLE score (value INTEGER, user TEXT, created_date TEXT);");


    for(var i = 0; i < scores.length; i++){
      db.run("INSERT INTO score (value, user, created_date) VALUES (?,?,?)",
        scores[i].value,scores[i].user,scores[i].created_date);
    }
  });
}

api.listen(3000);