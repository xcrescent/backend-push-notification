const admin = require('firebase-admin');
const db = admin.firestore();

const USERS_COLLECTION = 'users';

// Register a new user
exports.registerUser = async (req, res) => {
    const { email, fcmToken } = req.body;

    if (!email  || !fcmToken) {
        return res.status(400).json({ error: 'Email, accessToken, and fcmToken are required' });
    }

    try {
        const userRef = db.collection(USERS_COLLECTION).doc(email);
        await userRef.set({ email, fcmToken });
        // res.status(201).json({ message: 'User registered successfully' });
        res.redirect('/register-success');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Update user's FCM token
exports.updateFcmToken = async (req, res) => {
    const { email, fcmToken } = req.body;

    if (!email || !fcmToken) {
        return res.status(400).json({ error: 'Email and fcmToken are required' });
    }

    try {
        const userRef = db.collection(USERS_COLLECTION).doc(email);
        await userRef.update({ fcmToken });
        res.status(200).json({ message: 'FCM token updated successfully' });
    } catch (error) {
        console.error('Error updating FCM token:', error);
        res.status(500).json({ error: 'Failed to update FCM token' });
    }
};
