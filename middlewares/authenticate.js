const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse} = require('../utils/responseUtils');

dotenv.config();

const verifyToken = (token) =>{
    return new Promise((resolve, reject) => {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, user) => {
            if (err) return reject(err);
            resolve(user);
        });
    });
};

module.exports = () => {
    return async(req,res,next) => {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json(
                errorResponse(
                    401,
                    null,
                    'Authorization token was not provided or was not valid',
                    false
                )
            );
        };

        const token = req.headers.authorization.split(" ")[1];

        try {
            const user = await verifyToken(token);
            req.user = user.user;
            return next();
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json(
                    errorResponse(
                        401,
                        null,
                        'Token expired',
                        false
                    )
                );
            };

            return res.status(401).json(
                errorResponse(
                    401,
                    null,
                    'Authorization token was not provided or was not valid',
                    false
                )
            );
        };
    };
};