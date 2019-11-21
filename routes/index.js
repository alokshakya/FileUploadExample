var express = require('express');
var index = express.Router();
var path = require('path');

/* GET home page. */
index.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, '../public', 'up.html'));
  //res.sendFile(path.join(__dirname, '../public','up.html'));
  //res.sendFile(path.join(__dirname, '../public', 'index1.html'));
});

module.exports = index;
