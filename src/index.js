const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(PORT || 3000, () => console.log(`Listening to port ${PORT}`));

module.exports = app;
