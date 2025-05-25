const getError = (error) => {
    if (error.response) {
        if (error.response.data && error.response.data.error && error.response.data && error.response.data.error) {
            return getError(error.response.data.error);
        }
    }
    if (typeof error === 'string' || error instanceof String) {
        return { message: error };
    }
    if (error.message) {
        return { message: error.message, code: error.code };
    }
    if (error.error) {
        return getError(error.error);
    }
    return { message: 'Generic Error' };
};

module.exports = {
    getError
};
