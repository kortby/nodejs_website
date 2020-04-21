const express = require('express');
const router = express.Router();

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (params) => {
  const { speakerService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      if (req.session.page_views) {
        req.session.page_views++;
        console.log(
          'You visited this page ' + req.session.page_views + ' times'
        );
      } else {
        req.session.page_views = 1;
        console.log('Welcome to this page for the first time!');
      }
      return res.render('layout', {
        pageTitle: 'Welcome from node express',
        template: 'index',
        topSpeakers,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
};
