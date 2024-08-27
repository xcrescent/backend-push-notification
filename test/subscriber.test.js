const { expect } = require('chai');
const sinon = require('sinon');
const { subscribe } = require('../src/controller/pubsubController');

describe('Subscriber Service', () => {
    let messageHandlerStub;

    beforeEach(() => {
        messageHandlerStub = sinon.stub().callsFake((message) => {
            const payload = JSON.parse(message.data.toString());
            message.ack();
        });
        sinon.replace(subscribe, 'subscribe', messageHandlerStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle incoming messages', () => {
        const message = {
            data: Buffer.from(JSON.stringify({ user: 'user1@example.com', message: 'Hello, John!' })),
            ack: sinon.stub()
        };
        messageHandlerStub(message);
        expect(message.ack.calledOnce).to.be.true;
    });
});
