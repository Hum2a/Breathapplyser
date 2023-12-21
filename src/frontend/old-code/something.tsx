// /* IMPORTS */

// import React, { useState, useEffect } from 'react';
// import { TouchableOpacity, Button, View, Text, FlatList, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { LineChart } from 'react-native-chart-kit';
// import RNFS from 'react-native-fs';

// /* DATABASE */

// // Global object to store entry data
// const globalData = {
//   entries: []
// };

// // Function to save entry data to a file
// const saveEntryDataToFile = async () => {
//   const entryData = JSON.stringify(globalData.entries);

//   try {
//     await RNFS.writeFile('entryData.txt', entryData, 'utf8');
//     console.log('Entry data saved successfully!');
//   } catch (error) {
//     console.log('Error saving entry data:', error);
//   }
// };

// // Function to load entry data from a file
// const loadEntryDataFromFile = async () => {
//   try {
//     const filePath = 'entryData.txt';
//     const fileExists = await RNFS.exists(filePath);

//     if (fileExists) {
//       const fileData = await RNFS.readFile(filePath, 'utf8');
//       globalData.entries = JSON.parse(fileData);
//     }
//   } catch (error) {
//     console.log('Error loading entry data:', error);
//   }
// };

// // Function to clear all entries
// const clearEntries = async () => {
//   try {
//     const filePath = 'entryData.txt';
//     const fileExists = await RNFS.exists(filePath);

//     if (fileExists) {
//       const emptyEntryData = JSON.stringify([]);
//       await RNFS.writeFile(filePath, emptyEntryData, 'utf8');
//       globalData.entries = [];
//       console.log('Entries cleared!');
//     } else {
//       console.log('No entries to clear.');
//     }
//   } catch (error) {
//     console.log('Error clearing entries:', error);
//   }
// };


// /* SCREENS */

// // Drop Down Items

// const dropdownItems = [
//   { label: 'Amount', value: 'amount' },
//   { label: 'Brand', value: 'brand' },
//   { label: 'Units', value: 'units' },
//   { label: 'Price', value: 'price' },
//   { label: 'Type', value: 'type' },
// ];

// const amountDropdownItems = [
//   { label: '1', value: '1' },
//   { label: '2', value: '2' },
//   { label: '3', value: '3' },
// ];

// const brandDropdownItems = [
//   { label: 'Item 1', value: 'item1' },
//   { label: 'Item 2', value: 'item2' },
//   { label: 'Item 3', value: 'item3' },
// ];

// const unitsDropdownItems = [
//   { label: 'Item 1', value: 'item1' },
//   { label: 'Item 2', value: 'item2' },
//   { label: 'Item 3', value: 'item3' },
// ];

// const priceDropdownItems = [
//   { label: 'Item 1', value: 'item1' },
//   { label: 'Item 2', value: 'item2' },
//   { label: 'Item 3', value: 'item3' },
// ];

// const typeDropdownItems = [
//   { label: 'Item 1', value: 'item1' },
//   { label: 'Item 2', value: 'item2' },
//   { label: 'Item 3', value: 'item3' },
// ];

// const styles = StyleSheet.create({
//   container: {
//     zIndex: 10, // Increase the zIndex of the dropdown container
//   },
//   dropdownPicker: {
//     backgroundColor: '#fafafa',
//     zIndex: 10,
//   },
//   dropdownPickerFront: {
//     zIndex: 100, // Increase the zIndex of the active dropdown menu
//   },
// });


// // Title Screen
// function TitleScreen({ navigation, route }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         title="Start Drinking"
//         onPress={() => navigation.navigate('Drinking')}
//       />
//     </View>
//   );
// }

// // Drinking Screen
// function DrinkingScreen({ navigation, route }) {
//   const [amountOpen, setAmountOpen] = useState(false);
//   const [brandOpen, setBrandOpen] = useState(false);
//   const [priceOpen, setPriceOpen] = useState(false);
//   const [unitsOpen, setUnitsOpen] = useState(false);
//   const [typeOpen, setTypeOpen] = useState(false);

//   const [amount, setAmount] = useState(' ');
//   const [brand, setBrand] = useState(' ');
//   const [units, setUnits] = useState(' ');
//   const [price, setPrice] = useState(' ');
//   const [type, setType] = useState(' ');

//   // Data for the line chart
//   const chartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         data: [20, 45, 28, 80, 99, 43],
//       },
//     ],
//   };

//     // Function to add a new entry
//   const addButtonClicked = () => {
//     // Create a new entry object with selected values and current date and time
//     const newEntry = {
//       amount,
//       brand,
//       units,
//       price,
//       type,
//       date: new Date().toISOString(),
//     };

//     // Check for duplicate entries
//     const existingEntry = globalData.entries.find((entry) => entry.date === newEntry.date);
//     if (!existingEntry) {
//       globalData.entries.push(newEntry);
//       saveEntryDataToFile()
//       console.log('New entry added successfully')
//     } else {
//       console.log('Duplicate entry found!');
//     }

//     // Reset the dropdown picker values
//     setAmount('');
//     setBrand('');
//     setUnits('');
//     setPrice('');
//     setType('');
//   };

//   const [selectedDropdown, setSelectedDropdown] = useState(null);

//   const renderItem = ({ item }) => {
//     let dropdownItems = [];
//     let setOpenFunction = () => {};
//     let dropdownZIndex = 0;
//     let containerZIndex = 0;
  
//     switch (item.value) {
//       case 'amount':
//         dropdownItems = amountDropdownItems;
//         setOpenFunction = setAmountOpen;
//         dropdownZIndex = 10;
//         containerZIndex = 5;
//         break;
//       case 'brand':
//         dropdownItems = brandDropdownItems;
//         setOpenFunction = setBrandOpen;
//         dropdownZIndex = 9;
//         containerZIndex = 4;
//         break;
//       case 'units':
//         dropdownItems = unitsDropdownItems;
//         setOpenFunction = setUnitsOpen;
//         dropdownZIndex = 8;
//         containerZIndex = 3;
//         break;
//       case 'price':
//         dropdownItems = priceDropdownItems;
//         setOpenFunction = setPriceOpen;
//         dropdownZIndex = 7;
//         containerZIndex = 2;
//         break;
//       case 'type':
//         dropdownItems = typeDropdownItems;
//         setOpenFunction = setTypeOpen;
//         dropdownZIndex = 6;
//         containerZIndex = 1;
//         break;
//       default:
//         break;
//     }
  
//     return (
//       <View style={[styles.container, { zIndex: containerZIndex }]}>
//         <DropDownPicker
//           value={
//             item.value === 'amount'
//               ? amount
//               : item.value === 'brand'
//               ? brand
//               : item.value === 'units'
//               ? units
//               : item.value === 'price'
//               ? price
//               : type
//           }
//           items={dropdownItems.map((dropdownItem) => ({
//             label: dropdownItem.label,
//             value: dropdownItem.value,
//           }))}
//           open={
//             item.value === 'amount'
//               ? amountOpen
//               : item.value === 'brand'
//               ? brandOpen
//               : item.value === 'units'
//               ? unitsOpen
//               : item.value === 'price'
//               ? priceOpen
//               : typeOpen
//           }
//           setOpen={(isOpen) => setOpenFunction(isOpen)}
//           setValue={
//             item.value === 'amount'
//               ? setAmount
//               : item.value === 'brand'
//               ? setBrand
//               : item.value === 'units'
//               ? setUnits
//               : item.value === 'price'
//               ? setPrice
//               : setType
//           }
//           placeholder={`Select ${item.label}`}
//           containerStyle={{ height: 40, marginTop: '8%' }}
//           style={[
//             styles.dropdownPicker,
//             item.value === selectedDropdown ? styles.dropdownPickerFront : null,
//             { zIndex: dropdownZIndex },
//           ]}         
//           itemStyle={{ justifyContent: 'flex-start' }}
//           dropDownStyle={{ backgroundColor: '#fafafa' }}
//           onChangeItem={(item) => {
//             if (item.value === 'amount') setAmount(item.value);
//             else if (item.value === 'brand') setBrand(item.value);
//             else if (item.value === 'units') setUnits(item.value);
//             else if (item.value === 'price') setPrice(item.value);
//             else if (item.value === 'type') setType(item.value);
//           }}
//           onOpen={() => {
//             setOpenFunction(true);
//             setSelectedDropdown(item.value);
//           }}
//           onClose={() => {
//             setOpenFunction(false);
//             setSelectedDropdown(null);
//           }}
//         />
//       </View>
//     );
//   };
  
//   return (
    // <View style={{ flex: 1 }}>
    //   {/* Line Chart */}
    //   <View style={{ marginTop: 20 }}>
    //     <LineChart
    //       data={chartData}
    //       width={350}
    //       height={200}
    //       chartConfig={{
    //         backgroundColor: '#ffffff',
    //         backgroundGradientFrom: '#ffffff',
    //         backgroundGradientTo: '#ffffff',
    //         decimalPlaces: 0,
    //         color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    //         labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    //       }}
    //     />
    //   </View>

//       {/* Dropdowns */}
//       <FlatList
//         data={dropdownItems}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.value}
//       />


//       {/* <DropDownPicker
//         open={amountOpen}
//         value={amount}
//         items={amountDropdownItems}
//         setOpen={setAmountOpen}
//         setValue={setAmount}
//         placeholder="Select Amount"
//         defaultValue={amount}
//         containerStyle={{ height: 40, marginTop: '20%', zIndex: 5 }}
//         style={{ backgroundColor: '#fafafa', zIndex: 5 }}
//         itemStyle={{ justifyContent: 'flex-start', zIndex: 5 }}
//         dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 10 }}
//         onChangeItem={(item) => setAmount(item.value)}
//         onOpen={() => {
//           setAmountOpen(true);
//           setBrandOpen(false);
//           setPriceOpen(false);
//           setUnitsOpen(false);
//           setTypeOpen(false);
//         }}
//         onClose={() => setAmountOpen(false)}
//       />

//       <DropDownPicker
//         open={brandOpen}
//         value={brand}
//         items={brandDropdownItems}
//         setOpen={setBrandOpen}
//         setValue={setBrand}
//         placeholder="Select Brand"
//         defaultValue={brand}
//         containerStyle={{ height: 40, marginTop: '8%', zIndex: 4 }}
//         style={{ backgroundColor: '#fafafa', zIndex: 4 }}
//         itemStyle={{ justifyContent: 'flex-start', zIndex: 4 }}
//         dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 9 }}
//         onChangeItem={(item) => setBrand(item.value)}
//         onOpen={() => {
//           setBrandOpen(true);
//           setAmountOpen(false);
//           setPriceOpen(false);
//           setUnitsOpen(false);
//           setTypeOpen(false);
//         }}
//         onClose={() => setBrandOpen(false)}
//       />

//       <DropDownPicker
//         open={priceOpen}
//         value={price}
//         items={priceDropdownItems}
//         setOpen={setPriceOpen}
//         setValue={setPrice}
//         placeholder="Select Price"
//         defaultValue={price}
//         containerStyle={{ height: 40, marginTop: '8%', zIndex: 3 }}
//         style={{ backgroundColor: '#fafafa', zIndex: 3 }}
//         itemStyle={{ justifyContent: 'flex-start', zIndex: 3 }}
//         dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 8 }}
//         onChangeItem={(item) => setPrice(item.value)}
//         onOpen={() => {
//           setPriceOpen(true);
//           setAmountOpen(false);
//           setBrandOpen(false);
//           setUnitsOpen(false);
//           setTypeOpen(false);
//         }}
//         onClose={() => setPriceOpen(false)}
//       />

//       <DropDownPicker
//         open={unitsOpen}
//         value={units}
//         items={unitsDropdownItems}
//         setOpen={setUnitsOpen}
//         setValue={setUnits}
//         placeholder="Select Units"
//         defaultValue={units}
//         containerStyle={{ height: 40, marginTop: '8%', zIndex: 2 }}
//         style={{ backgroundColor: '#fafafa', zIndex: 2 }}
//         itemStyle={{ justifyContent: 'flex-start', zIndex: 2 }}
//         dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 7 }}
//         onChangeItem={(item) => setUnits(item.value)}
//         onOpen={() => {
//           setUnitsOpen(true);
//           setAmountOpen(false);
//           setBrandOpen(false);
//           setPriceOpen(false);
//           setTypeOpen(false);
//         }}
//         onClose={() => setUnitsOpen(false)}
//       />

//       <DropDownPicker
//         open={typeOpen}
//         value={type}
//         items={typeDropdownItems}
//         setOpen={setTypeOpen}
//         setValue={setType}
//         placeholder="Select Type"
//         defaultValue={type}
//         containerStyle={{ height: 40, marginTop: '8%', zIndex: 1 }}
//         style={{ backgroundColor: '#fafafa', zIndex: 1 }}
//         itemStyle={{ justifyContent: 'flex-start', zIndex: 1 }}
//         dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 6 }}
//         onChangeItem={(item) => setType(item.value)}
//         onOpen={() => {
//           setTypeOpen(true);
//           setAmountOpen(false);
//           setBrandOpen(false);
//           setPriceOpen(false);
//           setUnitsOpen(false);
//         }}
//         onClose={() => setTypeOpen(false)}
//       /> */}

//       {/* Buttons */}

//       {/* Add Button*/}
//       <TouchableOpacity
//         style={{
//           alignSelf: 'center',
//           backgroundColor: 'blue',
//           borderRadius: 8,
//           paddingVertical: 8,
//           paddingHorizontal: 16,
//           marginTop: 16,
//         }}
//         onPress={addButtonClicked}
//       >
//         <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add</Text>
//       </TouchableOpacity>

//       {/* View Drinks Button*/}
//       <TouchableOpacity
//         style={{
//           alignSelf: 'center',
//           backgroundColor: 'blue',
//           borderRadius: 8,
//           paddingVertical: 8,
//           paddingHorizontal: 16,
//           marginTop: 16,
//         }}
//         onPress={() => navigation.navigate('Drank')}
//       >
//         <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>View Drink Entries</Text>
//       </TouchableOpacity>

//       {/* Clear Entries Button */}
//       <TouchableOpacity
//         style={{
//           alignSelf: 'center',
//           backgroundColor: 'red',
//           borderRadius: 8,
//           paddingVertical: 8,
//           paddingHorizontal: 16,
//           marginTop: 16,
//         }}
//         onPress={() => clearEntries()} // Call the clearEntries function
//       >
//         <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Clear Entries</Text>
//       </TouchableOpacity>

//     </View>
//   );
// }

// // View Entries Screen
// function DrankScreen() {
//   useEffect(() => {
//     loadEntryDataFromFile();
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={globalData.entries}
//         renderItem={({ item }) => (
//           <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 10 }}>
//             <Text>Date: {item.date}</Text>
//             <Text>Amount: {item.amount}</Text>
//             <Text>Brand: {item.brand}</Text>
//             <Text>Units: {item.units}</Text>
//             <Text>Price: {item.price}</Text>
//             <Text>Type: {item.type}</Text>
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// }

// // APP NAVIGATION

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Title">
//         <Stack.Screen name="Title" component={TitleScreen} />
//         <Stack.Screen name="Drinking" component={DrinkingScreen} />
//         <Stack.Screen name="Drank" component={DrankScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;