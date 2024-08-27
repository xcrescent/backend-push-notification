module.exports = {
    pubsub: {
        projectId: 'pub-sub-notification',
        topicName: 'notifications',
        subscriptionName: 'notification-sub'
    },
    server: {
        port: process.env.PORT || 3000
    }
};
