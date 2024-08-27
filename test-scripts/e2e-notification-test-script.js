const { exec } = require('child_process');
const axios = require('axios');

async function runE2ETest() {
    console.log('Start Service...');
    const process = exec('node src/bin/www.js');
    process.stdout.on('data', (data) => console.log(`Data: ${data}`));


    await new Promise((resolve) => setTimeout(resolve, 2000)); // Give services time to start

    console.log('Sending request to Publisher Service...');
    const response = await axios.post('http://localhost:3000/notification/send-notifications', {
        users: ['user1@example.com', 'user2@example.com'],
        template: 'Hello, {name}! You have {notifications_count} new notifications.',
        dataMap: {
            name: 'John Doe',
            notifications_count: 5
        }
    });

    console.log('Publisher Response:', response.data);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Give time for processing

    process.kill();

    console.log('E2E Test Completed.');
}

runE2ETest().catch(console.error);
