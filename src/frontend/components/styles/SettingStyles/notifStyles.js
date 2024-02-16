import { StyleSheet } from "react-native";

export const notifStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF", // Background color for the entire screen
  },
  categoryHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333", // Dark text color
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#F0F0F0", // Background color for each notification item
    borderRadius: 8,
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 3, // Shadow radius
    elevation: 3, // Android elevation for shadow
  },
  notificationText: {
    fontSize: 18,
    color: "#333", // Dark text color
  },
  switchContainer: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Adjust switch size
  },
});
