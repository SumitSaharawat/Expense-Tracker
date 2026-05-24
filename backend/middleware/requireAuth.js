const jwt = require('jsonwebtoken');
const User = require('../models/users.models');

const requireAuth = async (req, res, next) => {
    // 1. Verify user is authenticated by checking the Authorization header
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // The header looks like: "Bearer eYjH......." Split it to get just the token string
    const token = authorization.split(' ')[1];

    try {
        // 2. Decode and verify the token using your JWT secret key string
        const { _id } = jwt.verify(token, process.env.SECRET);

        // 3. Attach the authenticated user's ID directly onto the request object
        req.user = await User.findOne({ _id }).select('_id');
        
        // Move on to the next function (the controller)
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;