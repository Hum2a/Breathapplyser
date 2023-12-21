const express = require('express');
const bodyParser = require('body-parser');

const { createTables } = require('./src/backend/queries/default/createTables');
const insertCurrencies = require('./src/backend/queries/default/insertCurrencies');

const db = require('./src/backend/database/db');

const {
  userRoutes,
  loginRoutes,
  registerRoutes,
  profileRoute,
  settingsRoutes,
  drunknessRoutes,
  bacRoutes,
  totalUnitsRoutes,
  realTimeBACRoutes
} = require('./src/backend/routes/routesIndex');

const app = express();
const PORT = process.env.PORT || 5432;

// Middleware to log each request
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`${now}: Received ${req.method} request to ${req.url} from ${req.ip}`);
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(registerRoutes);
app.use(loginRoutes);
app.use(profileRoute);
app.use(settingsRoutes);
app.use(drunknessRoutes);
app.use(bacRoutes);
app.use(totalUnitsRoutes);
app.use(realTimeBACRoutes);

// Test database connection
db.connect()
  .then(obj => {
    console.log("Server.js: Connected to the database successfully");
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error("Server.js: Error connecting to the database", error);
  });


// Create tables when the server starts
createTables().then(() => {
  console.log('Server.js: Tables creation attempted...');
}).catch(err => console.error('Server.js: Error creating tables:', err));

setInterval(() => {
  console.log('Server.js: Server check-in: still running');
}, 10000); // 10000 milliseconds = 10 seconds

