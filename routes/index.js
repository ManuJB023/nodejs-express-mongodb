const express = require('express');
const campsiteRouter = require('./campsiteRouter');

const app = express();

// Mount the campsite router on a specific path
app.use('/campsites', campsiteRouter);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Additional routes (if needed)
app.put('/', function(req, res, next) {
  // Handle PUT request on the root path
  res.send('PUT request received');
});

app.post('/', function(req, res, next) {
  // Handle POST request on the root path
  res.send('POST request received');
});

app.delete('/', function(req, res, next) {
  // Handle DELETE request on the root path
  res.send('DELETE request received');
});

module.exports = app;
