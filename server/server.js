const express = require("express");
const app = express();
const cors = require("cors");

// Import routes
const usersRouter = require('./routes/users');
const inboundRouter = require('./routes/inbound');
const outboundRouter = require('./routes/outbound');
const inventoryRouter = require('./routes/inventory');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/inbound', inboundRouter);
app.use('/api/outbound', outboundRouter);
app.use('/api/inventory', inventoryRouter);

// Start the server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});
