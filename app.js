const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan')

const indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async function (req, res, next) {
  let seasonMenu = async () => {
    function parseISOString(s) {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    const season = require('./utilities/season')

    let menu = await season.getAll();

    menu.forEach(m => {
      m.start = m.start.split('T')[0]
      m.end = m.end.split('T')[0]
    })
  
    return menu
  }
  
  seasonMenu().then(s => {
    app.locals.seasonMenu = s

    next()
  })
})


// TODO Implement authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
