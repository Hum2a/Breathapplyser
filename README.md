# Breathalyser

A modern, React Native mobile application for personal breathalyser functionality.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-latest-blue)

## Overview

Breathalyser is a mobile application that provides users with an accurate and convenient way to measure their blood alcohol content (BAC). Built with React Native to ensure cross-platform compatibility while maintaining native performance.

## Features

- Real-time BAC measurement
- User-friendly interface
- Historical data tracking
- Personalized user profiles
- Cross-platform support (iOS & Android)

## Screenshots

*Coming soon*

## Technology Stack

- React Native
- JavaScript/TypeScript
- Native Modules for sensor integration
- AsyncStorage/Redux for state management

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (>= 14.x)
- npm or Yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- React Native CLI

Follow the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide to configure your development environment.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/breathalyser.git
   cd breathalyser
   ```

2. Install dependencies:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. Install iOS dependencies (iOS development only):
   ```bash
   cd ios && pod install && cd ..
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the required environment variables:
   ```
   # Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id

   # Nutritionix API
   NUTRITIONIX_API_KEY=your_nutritionix_api_key
   NUTRITIONIX_API_URL=https://trackapi.nutritionix.com/v2/

   # Server URLs
   SERVER_BASE_URL=your_server_base_url
   ```
   > **Note:** Never commit your `.env` file to version control. The `.env` file is already added to `.gitignore`.

## Running the Application

### Start Metro Server

```bash
npm start
# OR
yarn start
```

### Run on Android

```bash
npm run android
# OR
yarn android
```

### Run on iOS

```bash
npm run ios
# OR
yarn ios
```

## Development

### Modifying the App

1. Open `App.tsx` or any other source file in your preferred code editor
2. Make your changes
3. Reload the app:
   - **Android**: Press <kbd>R</kbd> twice or use <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS)
   - **iOS**: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the iOS Simulator

## Troubleshooting

If you encounter issues during setup or development:

1. Ensure your development environment meets all prerequisites
2. Check the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
3. Clear the cache:
   ```bash
   npm start -- --reset-cache
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Community](https://github.com/react-native-community)
