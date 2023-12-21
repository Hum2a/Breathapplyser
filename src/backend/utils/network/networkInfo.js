// networkInfo.js
import { NetworkInfo } from "react-native-network-info";

const getNetworkInfo = async () => {
  return new Promise(async (resolve) => {
    let ipAddress;
    let ipv4Address;
    let broadcast;
    let ssid;
    let bssid;
    let subnet;
    let defaultGateway;
    let frequency;

    // Get Local IP
    ipAddress = await NetworkInfo.getIPAddress();
    console.log(`networkInfo.js: ipAddress = ${ipAddress}`);

    // Get IPv4 IP (priority: WiFi first, cellular second)
    ipv4Address = await NetworkInfo.getIPV4Address();
    console.log(`networkInfo.js: ipv4Address = ${ipv4Address}`);

    // Get Broadcast
    broadcast = await NetworkInfo.getBroadcast();
    console.log(`networkInfo.js: broadcast = ${broadcast}`);

    // Get SSID
    ssid = await NetworkInfo.getSSID();
    console.log(`networkInfo.js: ssid = ${ssid}`);

    // Get BSSID
    bssid = await NetworkInfo.getBSSID();
    console.log(`networkInfo.js: bssid = ${bssid}`);

    // Get Subnet
    subnet = await NetworkInfo.getSubnet();
    console.log(`networkInfo.js: subnet = ${subnet}`);

    // Get Default Gateway IP
    defaultGateway = await NetworkInfo.getGatewayIPAddress();
    console.log(`networkInfo.js: defaultGateway = ${defaultGateway}`);

    // Get frequency (supported only for Android)
    frequency = await NetworkInfo.getFrequency();
    console.log(`networkInfo.js: frequency = ${frequency}`);

    resolve({
      ipAddress,
      ipv4Address,
      broadcast,
      ssid,
      bssid,
      subnet,
      defaultGateway,
      frequency,
    });
  });
};

export default getNetworkInfo;
