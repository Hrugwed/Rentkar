const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.all('*', (req, res, next) => next(new Error('Not found')));
app.listen(3000, () => console.log('Running'));