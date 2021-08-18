const minify = require('url-minify').default;

module.exports = {
  shUrl: async (url) => {
    return await minify(url, { provider: 'tinyurl' });
  },
};
