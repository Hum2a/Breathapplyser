const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/backend/routes/userRoutes');
const registerRoutes = require('./src/backend/routes/registerRoutes');
const loginRoutes = require('./src/backend/routes/loginRoutes');
const { createTables } = require('./src/backend/queries/createTables');
const db = require('./src/backend/database/db');

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

// Test database connection
db.connect()
  .then(obj => {
    console.log("Connected to the database successfully");
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error("Error connecting to the database", error);
  });


// Create tables when the server starts
createTables().then(() => {
  console.log('Tables creation attempted...');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

setInterval(() => {
  console.log('Server check-in: still running');
}, 10000); // 10000 milliseconds = 10 seconds

