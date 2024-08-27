const express = require('express');
const router = express.Router();
const { publishMessage, subscribe } = require('../service/pubsubService');
const formatMessage = require('../utils/formatMessage');
const admin = require('firebase-admin');
const db = admin.firestore();

const USERS_COLLECTION = 'users';

const messageHandler = async (message) => {
    const payload = JSON.parse(message.data.toString());
    const { user, message: notificationMessage, fcmToken } = payload;

    console.log(`Sending notification to ${user}: ${notificationMessage} (${fcmToken})`);
    // Send push notification via FCM
    await admin.messaging().send({
        token: fcmToken,
        notification: {
            title: 'Notification',
            body: notificationMessage,
        },
        // data: payload,  // Optional, to pass additional data
    });
    console.log('Notification sent successfully');
    // Acknowledge the message
    message.ack();
};

// Start the subscriber
subscribe(messageHandler);

console.log('Subscriber is listening for messages...');
// Endpoint to send notifications
router.post('/send-notifications', async (req, res) => {
    const { users, template, dataMap } = req.body;

    if (!users || !template || !Array.isArray(users)) {
        return res.status(400).json({ error: 'Users, template, and data map are required' });
    }

    try {
        const userRefs = users.map(email => db.collection(USERS_COLLECTION).doc(email));
        const userSnapshots = await db.getAll(...userRefs);

        const userRecords = userSnapshots
            .filter(doc => doc.exists)
            .map(doc => doc.data());
        if (userRecords.length === 0) {
            return res.status(400).json({ error: 'User records not found' });
        }
        const promises = userRecords.map(async (user) => {
            // Format the message using the template and dataMap
            const message = formatMessage(template, dataMap);
            console.log(`Sending notification to ${user.email}: ${message}`);
            const payload = {
                user: user.email,
                message,
                fcmToken: user.fcmToken
            };

            // Publish message to Pub/Sub
            const messageId = await publishMessage(payload);
            console.log(`Message ${messageId} published for user ${user}`);
        });

        await Promise.all(promises);
        res.status(200).json({ status: 'Notifications sent' });
    } catch (error) {
        console.error('Error publishing message:', error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});

module.exports = router;
