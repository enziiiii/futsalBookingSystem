require('dotenv').config();

const express = require("express");
const app = express();
const router = require("./router/allRouter");
const { connectDb } = require("./config/db");
const errorHandling = require('./middlewares/errorHandler');
const initializeSchemaTable = require('./db/AllTable');
const cookieParser = require('cookie-parser');


app.use(cookieParser());

// middle-ware to parse JSON
app.use(express.json());


/* mount the router: to use the router in your main Express app, 
 you can "mount" it at a specific URL prefix */
app.use("/api", router);

// Error handling middleware
app.use(errorHandling);

// // Create table before starting server
// createUserTable();


const PORT = 5000;

async function startServer() {
    try {
        // database connectivity first
        const isConnected = await connectDb();
        if (!isConnected) throw new Error('Database connection failed');

        // Create tables
        await initializeSchemaTable();

        // start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Server initialization failed:', err);
        process.exit(1);
    }
}

startServer();


// to start the database connection
/* connectDb().then((isConnected) => {
    if (!isConnected) {
        console.error('Cannot start server: Database connection failed');
        process.exit(0);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); */

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