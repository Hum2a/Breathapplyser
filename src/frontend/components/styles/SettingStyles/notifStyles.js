import { StyleSheet } from "react-native";

export const notifStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#BAEAFF", // Light blue background for the entire screen
  },
  categoryHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#003366", // Darker shade of blue for headers
    alignSelf: 'center',
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#E7F2F8", // Very light blue, almost white, for notification items
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Subtle elevation for Android
  },
  notificationText: {
    fontSize: 18,
    color: "#005f73", // Slightly darker blue for text, ensures good readability
  },
  switchContainer: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Adjust switch size, maintain original scaling if preferred
  },
});
