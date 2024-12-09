const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const EventEmmiter = require('events');
const eventEmmiter = new EventEmmiter();
const { welcomeMail } = require('../utils/mailUtils');
const { successResponse, errorResponse } = require('../utils/responseUtils')

dotenv.config();

const newToken = (user, expireTime) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: expireTime,
    });
  };

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.send({
            message: "Please fill in all fields",
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = `INSERT INTO users(name, email, password, role) VALUES(?, ?, ?, ?)`;
        db.query(insertUserQuery, [name, email, hashedPassword, role], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json(
                        errorResponse(
                            400,
                            null,
                            'Email already exists',
                            false
                        )
                    );
                }
                throw err;
            }
        
            const fetchUserQuery = `SELECT * FROM users WHERE id = ?`;
            db.query(fetchUserQuery, [result.insertId], (err, users) => {
                if (err) {
                    return res.status(500).json(
                        errorResponse(
                            500,
                            null,
                            'Error retrieving user data',
                            false
                        )
                    );
                }
        
                const user = users[0];
                const token = newToken(user, '10m');
        
                eventEmmiter.on('userRegister', welcomeMail);
                eventEmmiter.emit('userRegister', {
                    email: process.env.GMAIL_USER,
                    to: user.email,
                    user,
                    html: `Hii, ${user.name}\n
                            <p>You have just registered with us 🎉😎🙌. So without delay, please verify your email using the link below:</p>\n
                            <h5 style="font-weight: bold;">Note: The verification link is valid for only 10 minutes</h5>
                            <a href='${process.env.CLIENT_URL}/api/v1/auth/emailVerification/${token}' >Click to verify</a>\n
                            Thanks and regards,<br/>
                            Sachin Sharma`,
                });
        
                return res.status(201).json(
                    successResponse(
                        201,
                        {
                            user,
                        },
                        'User registered successfully',
                        true
                    )
                );
            });
        });        

    } catch (err) {
        return res.status(500).json(
            errorResponse(
                500,
                null,
                'Something went wrong',
                false
            )
        );
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.send({
                message: "Please fill in all fields",
            })
        }

        const fetchUserDataQuery = `SELECT * FROM users WHERE email = ?`;

        db.query(fetchUserDataQuery,[email],async (err, results) => {
            if(err) {
                return res.status(500).json(
                    errorResponse(
                        500,
                        null,
                        'Database query failed',
                        false
                    )
                );
            };

            if(results.length === 0) {
                return res.status(401).json(
                    errorResponse(
                        401,
                        null,
                        'No user available',
                        false
                    )
                )
            }
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch){
                return res.status(400).json(
                    errorResponse(
                        400,
                        null,
                        'Incorrect password or email',
                        false
                    )
                );
            }

            if(user.status === 'inactive'){    
                const token = newToken(user, '10m')
                eventEmmiter.on('userRegister', welcomeMail);
                eventEmmiter.emit('userRegister', {
                    email: process.env.GMAIL_USER,
                    to: user.email,
                    user,
                    html: `Hii, ${user.name}\n
                            <p>You have just registered with us 🎉😎🙌.So wihout doing any late we want  you to verify your email first.Please use the below given link for the verification process</p> \n
                            <h5 style={fontWeight:'bold'}>Please note that the verification link is valid for only 10 minutes</h5>
                            <a href='${process.env.CLIENT_URL}/api/v1/auth/emailVerification/${token}' >Click to verify</a>\n
                            Thanks and regards <br/>
                            Sachin Sharma`,
                });

                return res.status(200).json(
                    successResponse(
                        200,
                        null,
                        'Please activate your account by verifying your email address',
                        true
                    )
                );
            };

            const token = newToken(user, '7d');
                return res.status(200).json(
                    successResponse(
                        200,
                        {
                            token: token,
                            profileStatus: user.profile_completed ? true : false,
                            userData: {
                                userId: user.id,
                                firstName: user.name,
                                email: user.email,
                                role: user.role,
                            },
                        },
                        'Login Successful',
                        true
                    )
                );
        })

    } catch (error) {
        return res.status(500).json(
            errorResponse(
                500,
                null,
                'Something went wrong',
                false
            )
        );
    };
};

const emailVarification = async (req, res) => {
    try {
        const token = req.params.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
                if (err) {
                    return res.status(400).json(
                        errorResponse(
                            400,
                            null,
                            'Token has expired',
                            false
                        )
                    );
                };

                const { id } = user.user;
                const setUserActiveQuery = `UPDATE users SET status = 'active' WHERE id = ? AND status = 'inactive'`;
                db.query(setUserActiveQuery, [id], async (err, result) => {
                    if (err) {
                        return res.status(500).json(
                            errorResponse(
                                500,
                                null,
                                'Something went wrong',
                                false
                            )
                        );
                    }
                    if (result.affectedRows === 0) {
                        return res.status(400).json(
                            errorResponse(400, null, 'User already active or not found', false)
                        );
                    }
                    
                    return res.redirect(`${process.env.CLIENT_URL}/login`);
                })
            })
        }

    } catch (error) {
        return res.status(500).json(
            errorResponse(
                500,
                null,
                'Something went wrong',
                false
            )
        );
    };
}


module.exports = {
    registerUser,
    loginUser,
    emailVarification
}