// Centralized error handling
const errorHandling = (err, req, res , next) => {
    console.log(err.stack);
    if (res.headerSent) {
        console.warn('Headers already sent, skipping error response');
        return next(err);
    }

    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: err.message,
    });
};

module.exports = errorHandling;