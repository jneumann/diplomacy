let obj = [];

obj.updateCards = function (scores) {

};

obj.getCards = async (start, end) => {
  const db = await require('./db')()

  let cards = {};
  
  if (start === undefined) {
    start = new Date('2000-01-01');
  } else {
    start = new Date(start)
  }

  if (end === undefined) {
    end = new Date('3000-01-01')
  } else {
    end = new Date(end)
  }

  await db.collection('scores').find({
    gameTime: {
      $gte: start,
      $lte: end
    }
  }).forEach(s => {
    s.players.forEach(p => {
      if (p.waive) {
        return;
      }

      if (cards[p.player] === undefined) {
        cards[p.player] = [];
        cards[p.player].push({
          Austria: null,
          England: null,
          France: null,
          Germany: null,
          Italy: null,
          Russia: null,
          Turkey: null
        })
      }

      if (cards[p.player][cards[p.player].length - 1][p.country] !== null) {
        cards[p.player].push({
          Austria: null,
          England: null,
          France: null,
          Germany: null,
          Italy: null,
          Russia: null,
          Turkey: null
        })
      }

      cards[p.player][cards[p.player].length - 1][p.country] = p.score
    })
  })

  var playerCards = [];
  for (const key in cards) {
    cards[key].forEach(c => {
      playerCards.push({
        player: key,
        Austria: (c.Austria === null ? 0 : c.Austria),
        England: (c.England === null ? 0 : c.England),
        France: (c.France === null ? 0 : c.France),
        Germany: (c.Germany === null ? 0 : c.Germany),
        Italy: (c.Italy === null ? 0 : c.Italy),
        Russia: (c.Russia === null ? 0 : c.Russia),
        Turkey: (c.Turkey === null ? 0 : c.Turkey),
        total: c.Austria + c.England + c.France + c.Germany + c.Italy + c.Russia + c.Turkey
      })
    })
  }

  playerCards.sort((a , b) => {
      if(a.total > b.total) return -1;
      if(a.total < b.total) return 1;
      return 0;
  });

  return playerCards;
}

module.exports = obj;