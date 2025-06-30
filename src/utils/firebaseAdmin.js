// ✅ Import the Firebase Admin SDK
const admin = require('firebase-admin');

// ✅ Parse the Firebase service account key from environment variable
const firebaseKey = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

// ✅ Fix the private_key formatting issue (convert escaped newlines to real newlines)
firebaseKey.private_key = firebaseKey.private_key.replace(/\\n/g, '\n');

// ✅ Initialize Firebase Admin SDK (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseKey), // 🔐 Use service account credentials
  });
}

// ✅ Export the initialized Firebase Admin instance
module.exports = admin;
