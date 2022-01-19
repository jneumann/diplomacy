const express = require('express'),
      router = express.Router(),
      game = require('../utilities/game'),
      card = require('../utilities/card')

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

router.get('/cards', async (req, res, next) => {
  let playerCards = await card.getCards();

  res.render('card', {cards: playerCards})
});

module.exports = router;
