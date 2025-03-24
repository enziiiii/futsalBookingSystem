const handleResponse = require("../utils/handleResponse");
const authService = require("../services/authService");
const { AppError } = require("../utils/customErrors");
const tokenService = require("../services/tokenService");
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require("../utils/cookieHelper");

// *--Home page Logic ------
const home = async (req, res) => {
    try {
        res
        .status(200)
        .send("hello welcome to home page using controller");

    } catch (error) {
        console.error("Error in home controller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // call the loginUser function from the authService.
        const { accessToken, refreshToken, userId } = await authService.loginUser(email, password);

        // set the refresh token cookie securly using the helper function
        setRefreshTokenCookie(res, refreshToken);

        // respond with the access token
        // handleResponse(res, 200, "Login successful", { userId: userId, token: accessToken });

        return res.status(200).json({ token: accessToken});
    } catch (error) {
        console.error("Login error:", error);

        if (error instanceof AppError) {
            return handleResponse(res, error.statusCode, error.message);
        }
        handleResponse(res, 500, "Internal server error");
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            // add token to blacklist
            const decodedRefresh = tokenService.verifyAccessToken(refreshToken);
            await tokenService.revokeToken(refreshToken, decodedRefresh.exp);
        }

        clearRefreshTokenCookie(res);

        handleResponse(res, 200, "Logout successfull");
    } catch (error) {
        handleResponse(res, 500, "Internal Server error");
    }
};


// *--Signup logic------
// --this way some logic are in services and some are here--//
const register = async (req, res) => {
    try {
        console.log("Request body received:", req.body);
        const userData = req.body;
        const result = await authService.registerUser(userData);
        handleResponse(res, 201, "Registration successful", result);
    } catch (error) {
        console.error("Registration error (original):", error.originalError || error); // Log raw error

        // handle all AppError instances (ValidationError, UserAlreadyExitsError, InternalServerError)
        if (error instanceof AppError) {
            return handleResponse(res, error.statusCode, error.message);
        }

        handleResponse(res, 500, "Internal server error");



        /* we can also do this way but i have explicitly introduce error from customError in up 
        // map service error to HTTP responses
        if (error.message.includes("already registered")) {
            handleResponse(res, 409, error.message);
        } else {
            handleResponse(res, 500, "Internal server error");
        }
            */
    }
};

module.exports = {
    home, 
    login, 
    logout, 
    register
};


/* we can also write this way, this way is simple, everything is in auth-controller.js
--------------------------------------------------------------------------
// *--Signup logic------
const register = async (req, res) => {
    try {
        const { username, fullName, email, password, phoneNumber } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phoneNumber) {
            return handleResponse(res, 400, "Credentials are required");
        }

        // check email existence
        const existingUser = await allModels.userModel.getUserByEmail(email);
        if (existingUser) {
            return handleResponse(res, 409, "Email already registered");
        }

        // hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user with only essential fiels
        const newUser = await allModels.userModel.createUser(
            username,
            fullName,
            email,
            passwordHash,
            phoneNumber
        );

        // respond with filteredUser data
        handleResponse(res, 201, "Registration successfyl", {
            id: newUser.user_id,
            username: newUser.username,
            createdAt: newUser.created_at
        });

    } catch (error) {
        console.error("Registration error:", error);

        // handle unique constraint violation for username
        if (error.code === '23505') {
            const message = error.contraint.includes('email')
                ? "Email already registered"
                : "Username already taken";

            return handleResponse(res, 409, message);
        }

        handleResponse(res, 500, "Internal server error");
    }

    //     console.log(req.body);
    //     const data = req.body;
    //     res.status(200).json({ data });
    // } catch (error) {
    //     res.status(500).json("internal server error");
    // }
};
----------------------------
*/
 

