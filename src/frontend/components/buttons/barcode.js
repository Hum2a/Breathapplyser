// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { BarcodeScannerView } from 'react-native-vision-camera';
// import { useCameraDevices } from 'react-native-vision-camera';
// import { Camera } from 'react-native-vision-camera';
// import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
// import { barcodeStyles } from '../components/styles/styles';

// const BarcodeScanner = ({ onScan }) => {
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const { cameraDevices } = useCameraDevices();
//   const cameraDevice = cameraDevices[0]; // Assuming the first camera device as the default one

//   useEffect(() => {
//     return () => {
//       // Cleanup code
//       closeCamera();
//     };
//   }, []);

//   const openCamera = () => {
//     setIsCameraOpen(true);
//   };

//   const closeCamera = () => {
//     setIsCameraOpen(false);
//   };

//   const handleBarcodeScanned = ({ barcodes }) => {
//     if (barcodes.length > 0) {
//       const scannedBarcode = barcodes[0].data;
//       onScan(scannedBarcode);
//       closeCamera();
//     }
//   };

//   const barcodeScanButton = (
//     <TouchableOpacity onPress={openCamera} style={barcodeStyles.button}>
//       <Text style={barcodeStyles.buttonText}>Scan Barcode</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={barcodeStyles.container}>
//       {!isCameraOpen ? (
//         barcodeScanButton
//       ) : (
//         <View style={barcodeStyles.cameraContainer}>
//           <Camera
//             style={barcodeStyles.camera}
//             cameraDevice={cameraDevice}
//             isActive={true}
//             onBarCodeScanned={handleBarcodeScanned}
//             barCodeTypes={[BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13]}
//             onTap={() => {}}
//           />
//           <TouchableOpacity onPress={closeCamera} style={barcodeStyles.closeButton}>
//             <Text style={barcodeStyles.closeButtonText}>Close Camera</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default BarcodeScanner;
