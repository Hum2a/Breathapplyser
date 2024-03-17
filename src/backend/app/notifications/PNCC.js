// PushNotificationCreateChannel.js
import PushNotification from 'react-native-push-notification';

const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: "drunkenness-level-channel", // Ensure this is unique for each channel you create
      channelName: "Drunkness Channel", // User-visible name of the channel
      channelDescription: "How drunk you are", // User-visible description of the channel
      playSound: false, // Whether sound should play when the notification is shown
      soundName: "default", // The sound to play (default sound is played if not specified)
      importance: 4, // Importance level (Android specific)
      vibrate: false, // Whether the phone should vibrate when the notification is shown
    },
    (created) => console.log(`CreateChannel returned '${created}'`) // Callback function to execute when channel creation is attempted
  );
};

export default createNotificationChannel;
