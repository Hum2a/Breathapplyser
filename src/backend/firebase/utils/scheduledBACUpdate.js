const functions = require('firebase-functions');
const { calculateCurrentBAC } = require('../../app/utils/calculations/calculateBAC');
const admin = require('firebase-admin');
admin.initializeApp();

exports.scheduledBACUpdate = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
    const db = admin.firestore();
    const usersRef = db.collection('users'); // Assume 'users' is your collection

    const snapshot = await usersRef.get();
    snapshot.forEach(async doc => {
        const userData = doc.data();
        // Assuming userData contains lastDrinkTime and lastBAC
        const currentBAC = calculateCurrentBAC(userData.lastDrinkTime, userData.lastBAC);

        await doc.ref.update({ currentBAC });
    });

    console.log('BAC updated for all users');
});
