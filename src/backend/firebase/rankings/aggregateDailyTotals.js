const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.aggregateDailyTotals = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  // Get the current date in 'YYYY-MM-DD' format
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Fetch daily totals for all users
  const usersSnapshot = await db.collection('users').get();
  const leaderboardData = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const dailyTotalsRef = db.doc(`/${userId}/Daily Totals/Amount Spent/${currentDate}`);
    const dailyTotalsSnapshot = await dailyTotalsRef.get();

    if (dailyTotalsSnapshot.exists) {
      const dailyTotalData = dailyTotalsSnapshot.data();
      leaderboardData.push({
        userId: userId,
        username: userDoc.data().username, // Assuming username is part of the user doc
        totalSpent: dailyTotalData.totalSpent || 0,
      });
    }
  }

  // 2. Calculate rankings based on the totals
  leaderboardData.sort((a, b) => b.totalSpent - a.totalSpent); // Sort by totalSpent in descending order

  // Add rank to each user based on sorted position
  leaderboardData.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // 3. Update the leaderboard collection with the new rankings
  const leaderboardRef = db.collection('leaderboard');
  
  // Clear the existing leaderboard collection
  const existingLeaderboardSnapshot = await leaderboardRef.get();
  existingLeaderboardSnapshot.forEach(doc => {
    doc.ref.delete();
  });

  // Add new rankings to the leaderboard collection
  leaderboardData.forEach(async entry => {
    await leaderboardRef.add(entry);
  });
});
