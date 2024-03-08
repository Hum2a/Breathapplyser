import { StyleSheet } from "react-native";

export const allStatsStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#BAEAFF',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    dateItem: {
      backgroundColor: '#f0f0f0',
      padding: 16,
      marginVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    dateText: {
      fontSize: 16,
    },
    detailedStatsContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: '#ffffff',
      borderRadius: 8,
    },
    detailedStatsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
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
  });