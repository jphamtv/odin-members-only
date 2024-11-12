// app.js
const express = require('express');
const path = require('node:path');
const passportConfig = require('./auth/passportConfig');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
passportConfig(passport);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
