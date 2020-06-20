const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

const typeEnum = {
    standard: "Letter (Standard)",
    metered: "Letter (Metered)",
    flat: "Large Envelopes (Flats)",
    firstclass: "First-Class Package Service\u2014Retail"
};

function rateCalc(weight, type) {
    switch (type) {
        case 'standard':
            if (weight <= 1)
                return 0.55;
            else if (weight <= 2)
                return 0.70;
            else if (weight <= 3)
                return 0.85;
            else
                return 1.00;
            break;
        case 'metered':
            if (weight <= 1)
                return 0.50;
            else if (weight <= 2)
                return 0.65;
            else if (weight <= 3)
                return 0.80;
            else
                return 0.95;
            break;
        case 'flat':
            return 1.00 + ((Math.ceil(weight) - 1) * .2);
            break;
        case 'firstclass':
            if (weight <= 4)
                return 3.80;
            else if (weight <= 8)
                return 4.60;
            else if (weight <= 12)
                return 5.30;
            else
                return 5.90;
        default:
            return 0;
    }
};

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .post('/getrate', [
    body('weightInput', 'Weight is required').not().isEmpty(),
    body('unitsRadio', 'Please select a unit').not().isEmpty(),
    body('packageRadio', 'Select a postal type').not().isEmpty()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            return res.redirect(307, '/displayrate')
        }
    })
    .post('/displayrate', (req, res) => {
        let price = rateCalc(req.body.weightInput, req.body.packageRadio);
        res.render('pages/rate', {
                weight: req.body.weightInput,
                units: req.body.unitsRadio,
                type: typeEnum[req.body.packageRadio],
                price: Number(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
