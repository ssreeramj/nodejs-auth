const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const verifyToken = req.header('Authorization');
    if (!verifyToken) return res.status(401).send('Access Denied');

    try {
        const verifiedUser = jwt.verify(verifyToken, process.env.SECRET_KEY);
        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};