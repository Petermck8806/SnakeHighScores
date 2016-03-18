var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('snakescores.db');

var express = require('express');
var api = express();

var bodyParser = require('body-parser');
api.use(bodyParser.json()); //parsing application/json
api.use(bodyParser.urlencoded({extended: true})); //parsing application/x-www-form-urlencoded

api.get('/', function(req,res){
  res.send('OK');
});

//GET /scores
//get all of the scores in the scores table.
api.get('/scores', function(req,res){
  console.log('GET/scores');
  db.all("SELECT * FROM score",function(err, rows){
    res.json(rows);
  });
});

//POST /scores
//insert one score
api.post('/scores', function(req,res){
  console.log('POST/scores');
  console.log(req.body);
  console.log(req.get('Content-Type'));

  if(req.get('Content-Type') != 'application/json'){
    console.log('406 not acceptable.');
    res.status(406);
    res.end();
  }

  var score = req.body; 

  if(score == undefined){
    res.status(406);
    res.end();
  }

  db.run("INSERT INTO score (value, user, created_date) VALUES (?,?,?)",
    score.value, score.user, score.created_date); 

  res.status(202);
  res.end();
});

//POST /allscores
//post all of the scores. This will truncate the scores table and insert new scores.
api.post('/allscores', function(req, res){
  console.log('POST/allscores');
  console.log(req.body);
  console.log(req.get('Content-Type'));

  if(req.get('Content-Type') != 'application/json'){
    console.log('406 not acceptable.');
    res.status(406);
    res.end();
  }

  var scores = req.body;

  if(scores == undefined || scores.length < 1){
    res.status(406);
    res.end();
  }

  repopulateScores(scores);

  res.status(202);
  res.end();
});

//drop and create score table
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