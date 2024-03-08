import { StyleSheet } from "react-native";

export const achievementStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F2FD', // Lighter shade of blue for the background
  },
  header: {
    fontSize: 26, // Slightly larger for prominence
    fontWeight: 'bold',
    color: '#0277BD', // Darker shade of blue for contrast
    marginBottom: 24, // Increased spacing for better visual separation
    textAlign: 'center', // Center align the header for a more balanced look
  },
  achievementItem: {
    paddingVertical: 20, // Increased vertical padding for a taller item
    paddingHorizontal: 15, // Balanced horizontal padding
    marginVertical: 10, // Increased vertical margin for more space between items
    backgroundColor: '#FFFFFF', // Pure white for the item background to stand out
    borderRadius: 10, // Rounded corners for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Specify shadow direction (downwards)
    shadowOpacity: 0.1,
    shadowRadius: 8, // Softer shadow
    elevation: 5, // Slightly elevated for a subtle 3D effect
  },
  title: {
    fontSize: 20, // Increased font size for better visibility
    fontWeight: 'bold',
    color: '#0277BD', // Use the theme's blue for titles for consistency
    marginBottom: 5, // Space between title and description
  },
  description: {
    fontSize: 16, // Larger than before for readability
    color: '#455A64', // Darker gray for better contrast and readability
  },
});
