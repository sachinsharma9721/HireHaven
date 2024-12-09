const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const fetchProfileDetail = async(req, res) => {
    const { userId } = req.body;
    const { role } = req.user;

    let = profileDetailQuery = '';

    if(!userId){
        return res.status(400).json(
            errorResponse(
                400,
                null,
                'userId required',
                false
            )
        );
    };

    try {
        if(role === 'job_seeker'){  
            profileDetailQuery = `
                SELECT 
                users.*, 
                job_seeker_profiles.* 
                FROM users
                LEFT JOIN job_seeker_profiles 
                ON users.id = job_seeker_profiles.user_id
                WHERE users.id = ?`
        }else{     
            profileDetailQuery = `
                SELECT 
                users.*, 
                employer_profiles.* 
                FROM users
                LEFT JOIN employer_profiles 
                ON users.id = employer_profiles.user_id
                WHERE users.id = ?`
        }

            db.query(profileDetailQuery, [userId], async(err,result) => {
                if(err){
                    return res.status(500).json(
                        500,
                        null,
                        'Something went wrong',
                        false
                    )
                };


                if(result.length === 0){
                    return res.status(404).json(
                        errorResponse(
                            404,
                            null,
                            'User not found',
                            false
                        )
                    );
                };

                return res.status(200).json(
                    successResponse(
                        200,
                        result[0],
                        'Profile details fetched successfully',
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


module.exports = {
    fetchProfileDetail
}