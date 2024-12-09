const db = require('../config/db');
const { successResponse, errorResponse } = require("../utils/responseUtils");


const jobSeekerProfileCreation = async (req, res) => {
    const {
        userId,
        phoneNumber, 
        address, 
        resume,
        experience,
        education,
        profileHeadlines,
        profileSummary,
        skills
    } = req.body;

    try {

        // const jobSeekerProfileCreateQuery = `UPDATE job_seeker_profiles SET
        //     phone_number = ?,
        //     address = ?,
        //     resume = ?,
        //     experience = ?,
        //     education = ?,
        //     profile_headline = ?,
        //     profile_summary = ?,
        //     skills = ?
        // `

        const jobSeekerProfileCreateQuery = `INSERT INTO job_seeker_profiles(user_id,phone_number,address,resume,experience,education,
            profile_headline,profile_summary,skills) VALUES(?,?,?,?,?,?,?,?,?)`;

        db.query(jobSeekerProfileCreateQuery, [userId,phoneNumber,address,resume,experience,education,profileHeadlines,profileSummary,skills], async(err,result) => {
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
                    'Candidate profile created successfully',
                    true
                )
            );
        });
        
        
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

const jobSeekerProfileUpdation = async(req, res) => {
    const {
        userId,
        phoneNumber, 
        address, 
        resume,
        experience,
        education,
        profileHeadlines,
        profileSummary,
        skills
    } = req.body;

    try {

        const jobSeekerProfileUpdateQuery = `UPDATE job_seeker_profiles SET
            phone_number = ?,
            address = ?,
            resume = ?,
            experience = ?,
            education = ?,
            profile_headline = ?,
            profile_summary = ?,
            skills = ?
            WHERE user_id = ?
        `

        db.query(jobSeekerProfileUpdateQuery, [phoneNumber,address,resume,experience,education,profileHeadlines,profileSummary,skills,userId], async(err,result) => {
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
                    'Candidate profile updated successfully',
                    true
                )
            )
        });
        
        
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


module.exports = {
    jobSeekerProfileCreation,
    jobSeekerProfileUpdation
}