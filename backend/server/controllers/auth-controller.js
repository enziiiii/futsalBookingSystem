

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
const register = async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({message: req.body });

    } catch (error) {
        res.status(500).json("internal server error");
    }
};
 

module.exports = {home, register};