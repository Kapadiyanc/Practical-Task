const jwt = require("jsonwebtoken");
const { secret } = require('../config/config');

const verifyToken = async (req, res, next) => {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({ 'status': 403, 'message': 'Token is required', "data" : {} });
    }
    
    try {
        const user = jwt.verify(token, secret);
        console.log(user);
        req.userId = user.userId;
    } catch (err) {
        return res.status(401).send({ 'status': 401, 'message': 'Invalid Token or unauthorized', "data" : {} });
    }
    next();
}

module.exports = verifyToken;