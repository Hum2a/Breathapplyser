import PushNotification from 'react-native-push-notification';

// Configure the notification service
PushNotification.configure({
  // Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('Notification:', notification);
  },
});

// Function to send a notification
export const sendNotification = (title, message) => {
  // Schedule the notification
  PushNotification.localNotification({
    title,
    message,
    channelId: 'default-channel',
  });
};
