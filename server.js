const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const routes = require('./routes/index');
const createError = require('http-errors');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');
const bodyParser = require('body-parser');
const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

// variables
app.locals.siteName = 'Fancy Meetups';
app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

const server = app.listen(3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.use((req, res, next) => {
  return next(createError(404, 'File not found'));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.log(err);
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});
