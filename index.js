const axios = require('axios');
const bodyParser = require('body-parser');
const { Category, Coordinates, Event } = require('./classUtils');
const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');
const path = require('path');
require('dotenv').config({
    path: '.env'
});
const PORT = process.env.PORT || 5000;
const BASE_URL = 'https://eonet.sci.gsfc.nasa.gov/api/v3';
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
    .post('/events', asyncHandler(async (req, res, next) => {
        const events = await axios.get(BASE_URL + '/events', req.body);
        res.send(events.data.events.map(event => new Event(event)));
    }))
    .post('/categories/*', asyncHandler(async (req, res, next) => {
        const filtered = await axios.get(BASE_URL + req.path, req.body);
        res.send(filtered.data.events.map(event => new Event(event)));
    }))
    .post('/categories', asyncHandler(async (req, res, next) => {
        const categories = await axios.get(BASE_URL + '/categories');
        res.send(categories.data.categories.map(category => new Category(category)));
    }))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
