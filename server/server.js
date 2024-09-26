const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");

app.use(session({
    secret: 'internship', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));

// Import routes
const usersRouter = require('./routes/users');
const inboundRouter = require('./routes/inbound');
const outboundRouter = require('./routes/outbound');
const inventoryRouter = require('./routes/inventory');

// Middleware
app.use(cors({
    origin: ["https://localhost:5173"],
    credentials: true
}));
app.use(express.json()); 

// Routes
app.use('/api/users', (req, res, next) => {
    console.log('Request to /api/users received');
    next();
});    
app.use('/api/inbound', inboundRouter);    
app.use('/api/outbound', outboundRouter);  
app.use('/api/inventory', inventoryRouter); 

// Start the server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});
