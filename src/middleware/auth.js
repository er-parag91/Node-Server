const auth = async (req, res, next) => {
    console.log('in the middleware');

    next();
}

module.exports = auth;