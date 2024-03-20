import { StyleSheet } from "react-native";

export const SettingStyles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: 'white',
      padding: 16,
    },
    fullscreen: {
        flex: 1,
        backgroundColor: '#BAEAFF',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 12,
    },
    text: {
      fontSize: 18,
    },
    smallIcon: {
      width: 70,
      height: 70,
      backgroundColor: 'transparent',
    },
    fileManagerIcon: {
      width: 100,
      height: 65,
      backgroundColor: 'transparent',
    },
  });
  