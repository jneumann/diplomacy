const axios = require('axios'),
    cheerio = require('cheerio')
    

let object = [];

object.byUrl = function(backstabberUrl) {
  let urlProcessed = new URL(backstabberUrl)

  urlProcessed = urlProcessed.hostname.replace("www\.", "").replace("\.com", '')

  if (urlProcessed !== 'backstabbr') {
      throw new Error('Invalid game host');
  }

  return axios(backstabberUrl)
      .then(response => {
          const html = response.data,
              $ = cheerio.load(html),
              legend = $('.legend span'),
              results = $('#results tr')

          let score = [];
      
          // Assign center score to each country
          results.each((idx, el) => {
            let country = $(el).find('.country').text().trim();
            let player = $($(el).find('td')[2]).text().trim()
      
            if (player !== '') {
              score.push({
                country: country,
                player: player,
                centers: 0,
                score: 0,
                waive: false
              });
            }
          });
      
          // Populate player name from bar on the right
          legend.each((idx, el) => {
            let country = $(el).text().trim().split(' ');
      
            if (country.length === 2) {
              score.forEach((s) => {
                if (s.country === country[0]) {
                  s.centers = parseInt(country[1]);
                }
              });
            }
          });
      
          return score;
        })
        .catch(console.error);
}

object.OMGScore = async function(url) {
  const SOLO_SCORE = 120

  let score = await this.byUrl(url);
  let solo = false;
      
  score.every(s => {
    // Check for a solo
    if (s.centers >= 18) {
      // This should be an environment variable
      s.score = SOLO_SCORE;
      solo = true;
      return;
    }
  });

  if (!solo) {
    let tops = [ [{
        index: -1,
        centers: -1
      }], [{
        index: -1,
        centers: -1
      }], [{
        index: -1,
        centers: -1
      }], ],
      firstPlaceBonus = 4.5,
      secondPlaceBonus = 3.0,
      thirdPlaceBonus = 1.5

    score.every(s => {
      if (s.centers > 0) {
        let cur_score = 0;
        cur_score = 1.5 * s.centers;
        cur_score += 9;
        s.score = cur_score;
      }
    });

    // Get first, second, third place players
    score.forEach((s, i) => {
      const score_model = {
        index: i,
        centers: s.centers
      };

      if (s.centers > tops[0][0].centers) {
        tops[2] = tops[1];
        tops[1] = tops[0];
        tops[0] = [score_model];
        return;
      }

      if (s.centers >  tops[0][0].centers) {
        tops[0].push(score_model);
        return;
      }

      if (s.centers >  tops[1][0].centers) {
        tops[2] = tops[1];
        tops[1] = [score_model];
        return;
      }

      if (s.centers >  tops[1][0].centers) {
        tops[1].push(score_model);
        return;
      }

      if (s.centers >  tops[2][0].centers) {
        tops[2] = [score_model]
        return;
      }

    });

    // Clears third place if there are 3 or more peopls in first and second
    if ((tops[0].length + tops[1].length) >= 3) {
      tops[2] = [];
    }

    if (tops[2].length > 1) {
      thirdPlaceBonus = thirdPlaceBonus / tops[2].length;
    }

    if (tops[1].length > 1) {
      secondPlaceBonus = (3.0 + 1.5) / tops[1].length;
      thirdPlaceBonus = 0.0;
    }

    if (tops[0].length === 2) {
      firstPlaceBonus = (4.5 + 3.0) / 2;
      secondPlaceBonus = 1.5 / tops[1].count
      thirdPlaceBonus = 0.0;
    }

    if (tops[0].length === 3) {
      firstPlaceBonus = (4.5 + 3.0 + 1.5) / tops[0].length;
      secondPlaceBonus = 0.0;
      thirdPlaceBonus = 0.0;
    }

    var survivalBonus = 9.0
        , tribute = tops[0][0].centers - tops[1][0].centers

    if (tops[0].length > 1) {
      tribute = 0.0;
    }

    score.forEach((s, i) => {
      if (s.centers > 0) {
        s.score = s.centers * 1.5 + survivalBonus;
      }

      tops[0].forEach(t => {
        if (t.index === i) {
          s.score += firstPlaceBonus
        }
      });

      tops[1].forEach(t => {
        if (t.index === i) {
          s.score += secondPlaceBonus
        }
      });

      tops[2].forEach(t => {
        if (t.index === i) {
          s.score += thirdPlaceBonus
        }
      });

      
    });

    score.forEach((s, i) => {
      let curTribute = tribute;
      if (s.score === 0) {
        return;
      }

      let inTop = false;

      tops[0].forEach(t => {
        if (t.index === i) {
          inTop = true;
        }
      });

      if (s.score > 0 && (s.score / 2) < tribute) {
          curTribute = s.score / 2
      }

      if (!inTop) {
        score[tops[0][0].index].score += curTribute;
        s.score -= curTribute;
      }
    });
  }

  return score;
}

object.saveBackstabbr = async function (backstabberUrl) {
  let self = this;

  let scores = await self.OMGScore(backstabberUrl)
  let players = [];

  scores.forEach(s => {
    players.push(s.player)
  });

  let gameObj = {
    url: backstabberUrl,
    gameTime: new Date(),
    players: scores
  }
  const db = await require('./db')()
  db.collection('scores').insertOne(gameObj);
}

module.exports = object;
