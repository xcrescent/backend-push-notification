const { PubSub } = require('@google-cloud/pubsub');
const config = require('../config/config');

const pubsub = new PubSub({ projectId: config.pubsub.projectId });
const topic = pubsub.topic(config.pubsub.topicName);
const subscription = pubsub.subscription(config.pubsub.subscriptionName);

async function publishMessage(payload) {
    const messageId = await topic.publish(Buffer.from(JSON.stringify(payload)));
    return messageId;
}

function subscribe(callback) {
    subscription.on('message', callback);
}

module.exports = {
    subscribe,
    publishMessage
};

