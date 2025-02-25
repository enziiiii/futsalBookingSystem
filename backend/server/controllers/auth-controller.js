const handleResponse = require("../utils/handleResponse");
const authService = require("../services/authService");


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

// *--Signup logic------
// --this way some logic are in services and some are here--//
const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        handleResponse(res, 201, "Registration successful", result);
    } catch (error) {
        // map service error to HTTP responses
        if (error.message.includes("already registered")) {
            handleResponse(res, 409, error.message);
        } else {
            handleResponse(res, 500, "Internal server error");
        }
    }
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

        // respond with filtereduser data
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
 

module.exports = {home, register};