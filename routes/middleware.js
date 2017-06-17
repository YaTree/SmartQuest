/**
 * Created by yatree on 17/06/17.
 */
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var md5 = require('md5');

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log('start1');
    // decode token
    if (token) {
        if (token) {
            console.log('start2');
            // verifies secret and checks exp
            jwt.verify(token, 'Secret!123', function(err, decoded) {
                console.log('start3');
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            console.log('start4');
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }
});

module.exports = router;
