import { StyleSheet } from "react-native";

export const visualHistoryStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3F2FD', // Lightest blue background
      },
      chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
        color: '#0D47A1', // Dark blue color
      },
      chart: {
        marginVertical: 8,
        borderRadius: 16,
      },
  });