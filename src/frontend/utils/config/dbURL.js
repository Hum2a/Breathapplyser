let serverBaseUrl = 'http://127.0.0.1:5432'; // Default value or placeholder

const setServerBaseUrl = (url) => {
  serverBaseUrl = url;
  console.log(`dbURL.js: Server Base URL set to: ${serverBaseUrl}`);
};

const getServerBaseUrl = () => {
  console.log(`dbURL.js: Getting Server Base URL: ${serverBaseUrl}`);
  return serverBaseUrl;
};

export { setServerBaseUrl, getServerBaseUrl };
