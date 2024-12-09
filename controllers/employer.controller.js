const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseUtils');


const employerProfileCreation = async (req, res) => {
    const { userId, companyName, companyDescription, companyAddress } = req.body;

    if (!userId || !companyName || !companyDescription || !companyAddress) {
        return res.status(400).json(
            errorResponse(
                400,
                null,
                'Missing required fields',
                false
            )
        );
    };

    try {
        const insertEmployerDataQuery = `
            INSERT INTO employer_profiles(user_id, company_name, company_description, company_address) 
            VALUES (?, ?, ?, ?)`;

        db.query(insertEmployerDataQuery, [userId, companyName, companyDescription, companyAddress], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(401).json(
                        errorResponse(
                            401,
                            null,
                            'A profile with this user ID already exists',
                            false
                        )
                    );
                }
                return res.status(500).json(
                    errorResponse(
                        500,
                        null,
                        err,
                        false
                    )
                );
            }

            return res.status(201).json(
                successResponse(
                    201,
                    null,
                    'Employer profile created successfully',
                    true
                )
            );
        });

    } catch (error) {
        return res.status(500).json(
            errorResponse(
                500,
                null,
                'An unexpected error occurred. Please try again later.',
                false
            )
        );
    }
};


const employerProfileUpdation = async (req, res) => {
    const { userId, companyName, companyDescription, companyAddress } = req.body;

    if (!userId || !companyName || !companyDescription || !companyAddress) {
        return res.status(400).json(
            errorResponse(
                400,
                null,
                'Missing required fields',
                false
            )
        );
    };

    try {

        const updateEmployerQuery = `UPDATE employer_profiles SET
          company_name = ?,
          company_description = ?,
          company_address = ? WHERE user_id = ?`;
        
        db.query(updateEmployerQuery, [companyName, companyDescription, companyAddress, userId], async (err,result) => {
            if(err){
                return res.status(500).json(
                    errorResponse(
                        500,
                        null,
                        err,
                        false
                    )
                );
            };

            if (result.affectedRows === 0) {
                return res.status(404).json(
                    errorResponse(
                        404,
                        null,
                        'User not found or no changes made',
                        false
                    )
                );
            };

            return res.status(200).json(
                successResponse(
                    200,
                    null,
                    'Employer profile updated successfully',
                    true
                )
            )
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
}



module.exports = {
    employerProfileCreation,
    employerProfileUpdation
}