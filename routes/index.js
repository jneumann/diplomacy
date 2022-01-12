const express = require('express'),
      router = express.Router(),
      game = require('../utilities/game')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game-save', function(req, res, next) {
  res.render('gameSave');
})

router.post('/game-save', async function (req, res, next) {
  let gameObj = {
    url: req.body.gameUrl,
    gameTime: new Date(),
    players: await game.OMGScore(req.body.gameUrl)
  }

  console.log(gameObj);

  res.render('gameSave');
});

module.exports = router;
