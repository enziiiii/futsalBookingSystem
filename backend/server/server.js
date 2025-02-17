require('dotenv').config();

const express = require("express");
const app = express();
const router = require("./router/auth-router.js");
const { connectDb } = require("./config/db");


// middle-ware to parse JSON
app.use(express.json());

/* mount the router: to use the router in your main Express app, 
 you can "mount" it at a specific URL prefix */
app.use("/api/auth", router);


const PORT = 5000;

// to start the database connection
connectDb().then((isConnected) => {
    if (!isConnected) {
        console.error('Cannot start server: Database connection failed');
        process.exit(0);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// another way to start the connection
/* const startServer = async () => {
    const isConnected = await connectDb();
    if (!isConnected) {
        console.error('Cannot start server: Database connection failed');
        process.exit(0);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
*/