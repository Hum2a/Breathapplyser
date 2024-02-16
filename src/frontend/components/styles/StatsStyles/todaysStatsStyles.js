import { StyleSheet } from "react-native";

export const TodaysStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    statContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 16,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    lastUpdated: {
      fontSize: 12,
      marginTop: 16,
      color: 'gray',
    },
  });