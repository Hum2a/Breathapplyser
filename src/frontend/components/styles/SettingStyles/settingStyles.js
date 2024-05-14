import { StyleSheet } from "react-native";

export const SettingStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(190,233,205)',
      paddingVertical: 50,
      paddingHorizontal: 15,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 15,
    },
    text: {
      fontSize: 18,
      color: '#333',
      fontFamily: 'my_coffee_break',
    },
    icon: {
      width: 30,
      height: 30,
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
    smallIcon: {
      width: 70,
      height: 70,
      backgroundColor: 'transparent',
    },
    fileManagerIcon: {
      width: 40,
      height: 30,
      backgroundColor: 'transparent',
    },
  });
  