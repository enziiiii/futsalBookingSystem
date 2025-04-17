// storing JWT in HTTP-Only cookies to make more secure

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict", // Prevent CSRF attacks
        path: '/api/auth/refresh' // limit cookie scope
    });

};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
};

module.exports = {
    setRefreshTokenCookie,
    clearRefreshTokenCookie
};