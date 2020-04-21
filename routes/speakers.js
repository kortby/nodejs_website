const express = require('express');
const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const speakers = await speakerService.getList();
      res.render('layout', {
        template: 'speakers',
        pageTitle: 'Speakers',
        speakers,
      });
    } catch (err) {
      return next(err);
    }
  });
  router.get('/:shortname', async (req, res) => {
    try {
      const speaker = await speakerService.getSpeaker(req.params.shortname);
      return res.render('layout', {
        template: 'partial/speaker',
        pageTitle: req.params.shortname,
        speaker,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
