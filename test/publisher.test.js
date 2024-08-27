const { expect } = require('chai');
const sinon = require('sinon');
const { publishMessage } = require('../src/controller/pubsubController');
const formatMessage = require('../src/utils/formatMessage');

describe('Publisher Service', () => {
    let publishStub;

    beforeEach(() => {
        publishStub = sinon.stub().resolves('message-id');
        sinon.replace(publishMessage, 'publishMessage', publishStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should format message correctly', () => {
        const template = 'Hello, {name}!';
        const dataMap = { name: 'John' };
        const formattedMessage = formatMessage(template, dataMap);
        expect(formattedMessage).to.equal('Hello, John!');
    });

    it('should publish messages to Pub/Sub', async () => {
        const payload = { user: 'user1@example.com', message: 'Hello, John!' };
        const messageId = await publishMessage(payload);
        expect(messageId).to.equal('message-id');
        expect(publishStub.calledOnce).to.be.true;
    });
});
