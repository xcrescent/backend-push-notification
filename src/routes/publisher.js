const express = require('express');
const router = express.Router();
const { publishMessage, subscribe } = require('../controller/pubsubController');
const formatMessage = require('../utils/formatMessage');



const messageHandler = (message) => {
    const payload = JSON.parse(message.data.toString());
    const { user, message: notificationMessage } = payload;

    // Here, you'd integrate with your push notification service
    console.log(`Sending notification to ${user}: ${notificationMessage}`);

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
        const promises = users.map(async (user) => {
            // Format the message using the template and dataMap
            const message = formatMessage(template, dataMap);
            const payload = { user, message };

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
