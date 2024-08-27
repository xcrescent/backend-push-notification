module.exports = {
    pubsub: {
        projectId: process.env.PROJECT_ID,
        topicName: process.env.TOPIC_NAME,
        subscriptionName: process.env.SUBSCRIPTION_NAME
    },
    server: {
        port: process.env.PORT || 3000
    }
};
