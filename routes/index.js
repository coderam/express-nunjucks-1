var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'Teamlesser Home',
    currentYear: new Date().getFullYear(),
  });
});

router.get('/chat', function(req, res, next) {
  res.render('index', {
    title: 'Teamlesser Chat',
  });
});

module.exports = router;
