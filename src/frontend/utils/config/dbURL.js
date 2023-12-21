// import getNetworkInfo from "../../../backend/utils/networkInfo";

// const { ipv4Address } = getNetworkInfo();

// const dbURL = {
//     serverBaseUrl: `http://${ipv4Address}:5432`
// };

// export default dbURL;


// dbURL.js
let serverBaseUrl = 'http://10.0.2.2:5432'; // Default value or placeholder

const setServerBaseUrl = (url) => {
  serverBaseUrl = url;
  console.log(`Server Base URL set to: ${serverBaseUrl}`);
};

const getServerBaseUrl = () => {
  console.log(`Getting Server Base URL: ${serverBaseUrl}`);
  return serverBaseUrl;
};

export { setServerBaseUrl, getServerBaseUrl };
