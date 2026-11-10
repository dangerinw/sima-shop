const path = require('path');
const chinaDetailsHandler = require('../../api/china-details');

module.exports = function(app) {
  app.get('/api/china-details', (req, res) => {
    chinaDetailsHandler(req, res);
  });
};
