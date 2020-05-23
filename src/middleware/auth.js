const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) => {
    try {
        token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return User.findOne({
                _id: decoded._id,
                'tokens.token': token
            })
            .then(user => {
                if (!user) {
                    throw new Error();
                }
                req.token = token;
                req.user = user;
                next();
            })
            .catch(e => {
                res.status(401).send('Unauthenticated access to requested resource is prohibited!');
            });
    } catch (e) {
        res.status(401).send('Unauthenticated access to requested resource is prohibited!');
    }
}

module.exports = auth;