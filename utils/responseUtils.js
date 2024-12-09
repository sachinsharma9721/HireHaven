const successResponse = (code, data, message, status) => {
    return {
        statusCode: code,
        responseObject: data,
        message: message,
        status: status
    };
};

const errorResponse = (code, error, message) => {
    return {
        statusCode: code,
        errorRes: error,
        message: message,
        status: false
    };
};

module.exports = {
    successResponse,
    errorResponse
};