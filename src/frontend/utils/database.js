import RNFS from 'react-native-fs'
import moment from 'moment';

const DATA_FILE_PATH = RNFS.DocumentDirectoryPath + '/appData.txt';

// Global object to store entry data, profile data, and settings
export const globalData = {
  entries: [],
  profile: null,
  globalBAC: 0,
  settings: {
    spendingLimit: 0,
    drinkingLimit: 0,
  },
  chartData: [],
};

// Function to save entry data, profile data, and settings to a file
export const saveDataToFile = async () => {
  const data = JSON.stringify(globalData);

  try {
    await RNFS.writeFile(DATA_FILE_PATH, data, 'utf8');
    console.log('Data saved successfully!');
    console.log('Document Directory Path:', RNFS.DocumentDirectoryPath);
  } catch (error) {
    console.log('Error saving data:', error);
  }
};

// Function to load data from a file
export const loadDataFromFile = async () => {
  try {
    const fileExists = await RNFS.exists(DATA_FILE_PATH);

    if (fileExists) {
      const fileData = await RNFS.readFile(DATA_FILE_PATH, 'utf8');
      const parsedData = JSON.parse(fileData);
      globalData.entries = parsedData.entries;
      globalData.profile = parsedData.profile;
      globalData.settings = parsedData.settings;
      globalData.chartData = parsedData.chartData;
      globalData.globalBAC = parsedData.globalBAC;
    }
  } catch (error) {
    console.log('Error loading data:', error);
  }
};

// Function to clear all entries on a specific day
// export const clearEntries = async () => {
//   try {
//     const filePath = RNFS.DocumentDirectoryPath + '/appData.txt';
//     const fileExists = await RNFS.exists(filePath);

//     if (fileExists) {
//       const fileData = await RNFS.readFile(filePath, 'utf8');
//       const parsedData = JSON.parse(fileData);

//       // Filter out the drinking entries
//       const filteredEntries = parsedData.entries.filter(
//         (entry) => entry.hasOwnProperty('alcohol') && entry.hasOwnProperty('type')
//       );

//       parsedData.entries = filteredEntries;
//       const updatedData = JSON.stringify(parsedData);

//       await RNFS.writeFile(filePath, updatedData, 'utf8');
//       globalData.entries = filteredEntries;
//       console.log('Drinking entries cleared!');
//     } else {
//       console.log('No drinking entries to clear.');
//     }
//   } catch (error) {
//     console.log('Error clearing drinking entries:', error);
//   }
// };

export const clearEntries = async () => {
  try {
    const filePath = RNFS.DocumentDirectoryPath + '/appData.txt';
    const fileExists = await RNFS.exists(filePath);

    if (fileExists) {
      globalData.entries = []; // Clear all entries
      globalData.globalBAC = 0; // Reset BAC
      globalData.chartData = [];
      await saveDataToFile(); // Save the updated data to the file
      console.log('Entries cleared!');
    } else {
      console.log('No entries to clear.');
    }
  } catch (error) {
    console.log('Error clearing entries:', error);
  }
};

export const deleteAllData = async () => {
  try {
    const filePath = RNFS.DocumentDirectoryPath + '/appData.txt';
    await RNFS.unlink(filePath);

    // Clear entries, profile, settings, and BAC from globalData
    globalData.entries = [];
    globalData.profile = null;
    globalData.settings = {
      spendingLimit: 0,
      drinkingLimit: 0,
    };
    globalData.chartData = [];
    globalData.globalBAC = 0;

    // Clear realTimeBACValues from AsyncStorage
    await AsyncStorage.removeItem('realTimeBACValues');

    console.log('All data cleared!');
  } catch (error) {
    console.log('Error deleting data:', error);
  }
};

export const updateGlobalBAC = (value) => {
  globalData.globalBAC = value;
  saveDataToFile();
};
