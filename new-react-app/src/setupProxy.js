const path = require('path');

module.exports = function(app) {
  app.get('/api/china-details', (req, res) => {
    delete require.cache[require.resolve('../../api/china-details')];
    const chinaDetailsHandler = require('../../api/china-details');
    chinaDetailsHandler(req, res);
  });

  app.get('/api/fb-reviews', (req, res) => {
    delete require.cache[require.resolve('../../api/fb-reviews')];
    const fbReviewsHandler = require('../../api/fb-reviews');
    fbReviewsHandler(req, res);
  });
};
