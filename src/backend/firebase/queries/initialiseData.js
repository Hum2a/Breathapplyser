import { getFirestore, doc, setDoc } from 'firebase/firestore';


// Assume firebase has already been initialised elsewhere in your application
const firestore = getFirestore();

const initialiseDrunkParameters = async (userId) => {
    const drunkParamsRef = doc(firestore, userId, 'Drunk Parameters');
    const drunkParamsData = {
        levels: [
            { range: '0.00 - 0.01', simple: 'Sober', detailed: "You're completely unintoxicated... probably." },
            { range: '0.01 - 0.03', simple: 'Buzzed', detailed: 'Mild relaxation, slight body warmth, mood elevation.' },
            { range: '0.03 - 0.10', simple: 'Relaxed', detailed: 'Feelings of well-being, relaxation, lower inhibitions, sensation of warmth, minor impairment of reasoning and memory.' },
            { range: '0.10 - 0.15', simple: 'A Bit of a liability', detailed: 'Mild impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgement and self-control reduced, and caution, reason, and memory impaired.' },
            { range: '0.15 - 0.20', simple: 'Visibly Drunk', detailed: 'Significant impairment of motor coordination and loss of good judgement. Speech may be slurred; balance, vision, reaction time, and hearing will be impaired.' },
            { range: '0.20 - 0.25', simple: 'Embarrassing', detailed: 'Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) begins to appear.' },
            { range: '0.25 - 0.30', simple: 'Sickly', detailed: 'Dysphoria predominates, nausea may appear. The drinker has the appearance of a "sloppy drunk."' },
            { range: '0.30 - 0.35', simple: 'Either pull or go home', detailed: 'Feeling dazed, confused, or otherwise disoriented. May need help to stand or walk. If injured, may not feel the pain. Nausea and vomiting are possible.' },
            { range: '0.35 - 0.40', simple: 'Find a friend', detailed: 'Severe intoxication, needs assistance in walking; total mental confusion. Dysphoria with nausea and some vomiting.' },
            { range: '0.40 - 0.45', simple: 'Gonna Pass out', detailed: 'Loss of consciousness. The risk of death due to respiratory arrest is possible.' },
            { range: '0.45 - 0.50', simple: 'Call an Ambulance', detailed: 'This BAC level is comparable to surgical anesthesia and is considered a very life-threatening level of alcohol intoxication.' },
            { range: '0.50 - 2.00', simple: 'Death is coming', detailed: 'Onset of coma, and likelihood of death due to respiratory arrest.' }
        ]
    };
    await setDoc(drunkParamsRef, drunkParamsData);
    console.log('Drunk parameters initialised successfully for user:', userId);
};

const initialiseEmojis = async (userId) => {
    const emojiSettingsRef = doc(firestore, userId, 'Emojis');
    const emojiData = {
        'Sober': '😐',  // Example emoji
        'Buzzed': '😊',
        'Relaxed': '🙂',
        'A Bit of a liability': '😬',
        'Visibly Drunk': '🥴',
        'Embarrassing': '😵',
        'Sickly': '🤢',
        'Either pull or go home': '🥳',
        'Find a friend': '🤕',
        'Gonna Pass out': '😴',
        'Call an Ambulance': '🚑',
        'Death is coming': '💀'
    };
    await setDoc(emojiSettingsRef, emojiData);
    console.log('Emoji settings initialised successfully for user:', userId);
};

const initialiseBACRefreshRate = async (userId) => {
    const bacRefreshRateRef = doc(firestore, userId, 'BAC Refresh Rate');
    const bacRefreshRateData = {
        refreshInterval: 60000  // Default interval set to 1 minute (60000 milliseconds)
    };
    await setDoc(bacRefreshRateRef, bacRefreshRateData);
    console.log('BAC Refresh Rate initialised successfully for user:', userId);
};


const initialiseDisplaySettings = async (userId) => {
    const displaySettingsRef = doc(firestore, userId, 'Display');
    const displaySettingsData = {
        DrunkennessDisplay: 'both'  // Default mode set to 'both'
    };
    await setDoc(displaySettingsRef, displaySettingsData);
    console.log('Display settings initialised successfully for user:', userId);
};

const initialiseNotificationSettings = async (userId) => {
    const notificationSettingsRef = doc(firestore, userId, 'Notification Preferences');
    const notificationSettingsData = {
        'Notifications': {
            'Limit Warnings': true,
            'BAC Level Alert': true,
            'Hydration Reminder': true,
            'Designated Driver Reminder': true,
            'Personal Goal Achievement': true,
            'Alcohol Purchase Tracking': true,
            'Emergency Contacts': true,
            'Medication Warning': true,
            'Safe Drinking Tips': true,
            'Summary Report': true,
            'Community Notifications': true,
            'Maintenance Alerts': false,
            'Weather Related Alerts': true,
            'Personalised Recommendations': true,
            'Privacy and Data Notifications': false,
            'App Engagement': true,
            'Achievement Unlocks': true,
            'Social Invitations': true,
            'Withdrawal Symptoms': false
        },
        'Type of Notification': {
            'Positive': true,
            'Passive Aggressive': false,
            'Uplifting': true,
            'Comedic': false
        }
    };
    await setDoc(notificationSettingsRef, notificationSettingsData);
    console.log('Notification settings initialised successfully for user:', userId);
};

// Function to run all initializations
export const initialiseUserData = async (userId) => {
    try {
        await Promise.all([
            initialiseDrunkParameters(userId),
            initialiseEmojis(userId),
            initialiseBACRefreshRate(userId),
            initialiseDisplaySettings(userId),
            initialiseNotificationSettings(userId)
        ]);
        console.log('All user data initialised successfully.');
    } catch (error) {
        console.error('Failed to initialise user data:', error);
    }
};
  