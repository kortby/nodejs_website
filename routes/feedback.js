const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const validation = [
  check('name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A name is required'),
  check('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid email address is required'),
  check('title')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A title is required'),
  check('message')
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage('A message is required'),
];
module.exports = (params) => {
  const { feedbackService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const feedbacks = await feedbackService.getList();
      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback
        ? req.session.feedback.message
        : false;
      req.session.feedback = {};
      return res.render('layout', {
        pageTitle: 'feedback',
        template: 'feedback',
        feedbacks,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validation, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.feedback = {
        errors: errors.array(),
      };
      return res.redirect('/feedback');
    }
    console.log(req.body);
    const { name, email, title, message } = req.body;
    await feedbackService.addEntry(name, email, title, message);
    req.session.feedback = {
      message: 'Thank you for your feedback',
    };
    return res.redirect('/feedback');
  });

  router.post('/api', validation, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({ feedback });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
