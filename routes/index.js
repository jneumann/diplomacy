const express = require('express'),
      router = express.Router(),
      game = require('../utilities/game'),
      card = require('../utilities/card'),
      season = require('../utilities/season') 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game-save', function(req, res, next) {
  res.render('gameSave');
})

router.post('/game-save', async function (req, res, next) {
  game.saveBackstabbr(req.body.gameUrl);

  res.render('gameSave');
});

router.get('/games', (req, res, next) => {
  // TODO game editing and display
  throw "Not Implemented"
})

router.get('/cards', async (req, res, next) => {
  let playerCards = await card.getCards(req.query.start, req.query.end);

  res.render('card', {cards: playerCards})
});

router.get('/season', async (req, res, next) => {
  res.render('season');
})

router.post('/season', async (req, res, next) => {
  season.add(req.body);

  res.render('season');
})

module.exports = router;
