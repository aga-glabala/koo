const PROXY_CONFIG = {
  "/api": {
      "target": "http://localhost:3000/",
      "secure": false,
      "logLevel": "debug",
      "changeOrigin": true,
      "onProxyRes": function (proxyRes, req, res) {
        if (proxyRes.statusCode == 302 && proxyRes.headers.location) {
          proxyRes.headers.location = '/api' + proxyRes.headers.location;
        }
      },
      "pathRewrite": {
        "^/api": ""
      }
    },
};

module.exports = PROXY_CONFIG;