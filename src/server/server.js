const path = require('path');
const winston = require('winston');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const app = express();
const PORT = 8000;

app.use(compression());
app.use('/public', serveStatic(path.join(__dirname, '../../public')));
app.use('/public/app', serveStatic(path.join(__dirname, '../../dist/app')));
app.use('/public/css', serveStatic(path.join(__dirname, '../../dist/css')));
app.use(bodyParser.json());

// cryptocoins
app.use(
  '/public/cryptocoins',
  serveStatic(path.resolve(__dirname, '../../node_modules/cryptocoins-icons/webfont/'))
);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')));

// eslint-disable-next-line
app.use((err, req, res, next) => {
  winston.error(err);
  res.status(500).json(err);
});

app.listen(PORT, () => winston.info(`express listening on ${PORT}`));
