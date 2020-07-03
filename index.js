const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const api = require('./apiAdapter.js');
require('dotenv').config({
    path: '.env'
});
const PORT = process.env.PORT || 5000;

const BASE_URL = 'https://eonet.sci.gsfc.nasa.gov/api/v3/events';

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
        res.render(path.join(__dirname, 'views/pages/index'), {
            key: process.env.mapsAPIkey,
        });
    })
    .get('/events', asyncHandler(async (req, res, next) => {
        const events = await axios.get(BASE_URL, {
            params: {
                status: 'open',
                limit: 20
            }
        });
        res.send(events.data);
    }))
    /*
        .get('/events', asyncHandler(async (req, res, next)) => {
            const events = await axios.get('https://eonet.sci.gsfc.nasa.gov/api/v3/events')
            res.sendFile(path.join(__dirname, 'views/pages/index.html'))) }*/
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
