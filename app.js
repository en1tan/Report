const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const useragent = require('express-useragent');
const ymljs = require('yamljs');
const doc = ymljs.load('./swagger.yaml');
const swaggerUI = require('swagger-ui-express');
const redoc = require('redoc-express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const queryAuth = require('./utils/queryAuth');
const routes = require('./routes');

// Jobs [delete accounts]
const jobs = require('./utils/jobs');
jobs
  .deactivateAccounts()
  .then(() => console.log(`Account deletion script running`))
  .catch((e) => console.error(e));

//cors
app.use(cors());
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 12 * 60 * 60 * 1000,
    max: 20,
    message: 'You have exceeded the rate limit!',
    headers: true,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser reading data from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

app.use('/api/v1/', queryAuth(), routes);

app.get('/swagger.json', (req, res) => {
  res.sendFile('/swagger.json', { root: '.' });
});

app.use('/docs', swaggerUI.serve, swaggerUI.setup(doc));
app.get(
  '/map',
  redoc({
    title: 'Sorosoke API',
    specUrl: '/swagger.json',
  })
);
module.exports = app;
