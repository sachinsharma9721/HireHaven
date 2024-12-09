const { errorResponse, successResponse } = require('../utils/responseUtils');

module.exports = function(permittedRoles) {
    return function(req, res, next){
        const user = req.user;

        if (!user) {
            return res
              .status(401)
              .json(
                errorResponse(
                  401,
                  null,
                  'AUTHORIZATION_TOKEN_NOT_VALID',
                  false
                )
              );
        };
        const isPermitted = permittedRoles.some((role) =>
            user.role?.split(" ")?.includes(role)
        ); 


        if (!isPermitted) {
            return res
              .status(403)
              .json(
                errorResponse(
                  403,
                  null,
                  'PERMISSION_DENIED',
                  false
                )
              );
          };
          return next();

    };
}