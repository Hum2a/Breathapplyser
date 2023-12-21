// backend/routes/routesIndex.js

const userRoutes = require('./startUpEndpoints/userRoutes');
const loginRoutes = require('./startUpEndpoints/loginRoutes');
const registerRoutes = require('./startUpEndpoints/registerRoutes');
const profileRoute = require('./settingsEndpoints/profileRoute');
const settingsRoutes = require('./settingsEndpoints/settingsRoutes');
const drunknessRoutes = require('./chartEndpoints/drunknessRoutes');
const bacRoutes = require('./chartEndpoints/bacRoutes');
const totalUnitsRoutes = require('./chartEndpoints/totalUnitsRoutes');
const realTimeBACRoutes = require('./chartEndpoints/realTimeBACRoutes');

module.exports = {
  userRoutes,
  loginRoutes,
  registerRoutes,
  profileRoute,
  settingsRoutes,
  drunknessRoutes,
  bacRoutes,
  totalUnitsRoutes,
  realTimeBACRoutes
};
