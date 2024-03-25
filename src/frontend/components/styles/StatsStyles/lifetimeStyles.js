import { StyleSheet } from "react-native";

export const lifetimeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF', // Alice Blue background for the overall container
    },
    scrollView: {
        
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#0277BD', // Light Blue 800
        marginBottom: 20,
        textAlign: 'center',
    },
    tableContainer: {
        borderWidth: 2,
        borderColor: '#B3E5FC', // Light Blue 100
        borderRadius: 10, // Rounded corners for the table
        overflow: 'hidden', // Ensures inner items do not overflow the rounded corners
        elevation: 3,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#81D4FA', // Light Blue 300
        borderBottomWidth: 2,
        borderColor: '#B3E5FC', // Light Blue 100
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '700',
        paddingVertical: 15,
        color: '#FFFFFF', // White color for header text
        fontSize: 16,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#B3E5FC', // Light Blue 100
        backgroundColor: '#E1F5FE', // Light Blue 50
    },
    rowText: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: 15,
        color: '#0277BD', // Light Blue 800
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0277BD', // Light Blue 800
        marginTop: 30,
        marginBottom: 10,
    },
    summaryTable: {
        borderWidth: 2,
        borderColor: '#B3E5FC', // Light Blue 100
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#E1F5FE', // Light Blue 50
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 18,
        color: '#0277BD', // Light Blue 800
        fontWeight: '500',
    },
    expandedSection: {
        backgroundColor: '#E3F2FD', // Lighter shade for expanded section
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#B3E5FC', // Very light blue
    },
    detailText: {
        fontSize: 14,
        color: '#0277BD', // Similar to other text but slightly smaller
    },
    dayRangeButton: {
        backgroundColor: '#81D4FA', // Light Blue 300
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    dayRangeButtonText: {
        color: '#FFFFFF', // White color for text
        fontWeight: '600',
        textAlign: 'center',
    },
    dayRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 11,
    },
    dayRangeText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#0277BD', // Light Blue 800
    },
    dayRangeInput: {
        width: 60, // Adjust the width as needed
        textAlign: 'center',
        padding: 8,
        marginHorizontal: 10, // Adjust for spacing
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },    
});