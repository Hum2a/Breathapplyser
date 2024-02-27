// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const BarcodeScan = () => {
//   const [scanned, setScanned] = useState(false);

//   // Handle barcode detection
//   const onBarcodeScanned = ({ data }) => {
//     if (!scanned) {
//       setScanned(true);
//       alert(`Scanned barcode: ${data}`);
//     }
//   };

//   // Reset scanned state when component unmounts
//   useEffect(() => {
//     return () => {
//       setScanned(false);
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <RNCamera
//         style={styles.preview}
//         onBarCodeRead={onBarcodeScanned}
//         captureAudio={false}
//         androidCameraPermissionOptions={{
//           title: 'Permission to use camera',
//           message: 'We need your permission to use your camera',
//           buttonPositive: 'Ok',
//           buttonNegative: 'Cancel',
//         }}
//       >
//         <View style={styles.rectangleContainer}>
//           <View style={styles.rectangle} />
//         </View>
//       </RNCamera>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   rectangleContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'transparent',
//   },
//   rectangle: {
//     height: 200,
//     width: 200,
//     borderWidth: 2,
//     borderColor: '#00FF00',
//     backgroundColor: 'transparent',
//   },
// });

// export default BarcodeScan;