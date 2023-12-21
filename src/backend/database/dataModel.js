// dataModel.js
import RNFS from 'react-native-fs';

const DATA_FILE_PATH = RNFS.DocumentDirectoryPath + '/appData.txt';

const saveDataToFile = async (data) => {
  try {
    await RNFS.writeFile(DATA_FILE_PATH, JSON.stringify(data), 'utf8');
    console.log('Data saved successfully!');
  } catch (error) {
    console.log('Error saving data:', error);
  }
};

const loadDataFromFile = async () => {
  try {
    const fileExists = await RNFS.exists(DATA_FILE_PATH);

    if (fileExists) {
      const fileData = await RNFS.readFile(DATA_FILE_PATH, 'utf8');
      return JSON.parse(fileData);
    }

    return null;
  } catch (error) {
    console.log('Error loading data:', error);
    return null;
  }
};

export default {
  saveDataToFile,
  loadDataFromFile,
};
