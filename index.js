const express = require('express');
const bodyParser = require('body-parser');

const uploadRouter = require('./routes/upload');
const dbService = require('./services/dbService.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to PostgreSQL database
dbService.connect();

// Set up routers
app.use('/upload', uploadRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
