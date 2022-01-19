const res = require('express/lib/response');

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

router.get('/cards', async (req, res, next) => {
  let playerCards = await card.getCards(req.query.start, req.query.end);

  res.render('card', {cards: playerCards})
});

router.get('/season', async (req, res, next) => {
  const season = require('../utilities/season')

  let seasons = await season.getAll();

  seasons.forEach(m => {
    m.start = new Date(m.start).toISOString().split('T')[0]
    m.end = new Date(m.end).toISOString().split('T')[0]
  })

  res.render('season', {seasons: seasons});
})

router.post('/season', async (req, res, next) => {
  await season.add(req.body);

  let seasons = await season.getAll();

  seasons.forEach(m => {
    m.start = new Date(m.start).toISOString().split('T')[0]
    m.end = new Date(m.end).toISOString().split('T')[0]
  })

  res.render('season', {seasons: seasons});
})

router.get('/games', async (req, res, next) => {
  let games = await game.getAll(req.query.start, req.query.end)

  games.forEach(m => {
    m.gameTime = new Date(m.gameTime).toISOString().split('T')[0]
  })

  res.render('game/index', {games: games})
})

module.exports = router;
