const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api-china',
    createProxyMiddleware({
      target: 'https://fzht.xuxug.com/api/api',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api-china': '',
      },
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://xuegaokk.ayxds.com');
        proxyReq.setHeader('Referer', 'https://xuegaokk.ayxds.com/');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36');
      }
    })
  );
};
