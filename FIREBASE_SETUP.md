# Firebase Setup Guide for Web3 Social Wall

This guide will walk you through setting up Firebase Firestore for the Web3 Social Wall project.

## Prerequisites

- A Google account
- 5-10 minutes of time

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "web3-social-wall")
4. (Optional) Enable Google Analytics if you want usage statistics
5. Click **"Create project"**
6. Wait for the project to be created (30-60 seconds)
7. Click **"Continue"** when ready

## Step 2: Set Up Firestore Database

1. In the Firebase Console, click on **"Build"** in the left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**
4. Choose a location:
   - Select a region close to your users
   - **Note**: You cannot change this later
5. Start in **"Test mode"**:
   - Select **"Start in test mode"**
   - This allows read/write access for 30 days (perfect for development)
   - Click **"Next"**
6. Click **"Enable"**
7. Wait for Firestore to be initialized (30-60 seconds)

You should now see an empty Firestore database!

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to the **"Your apps"** section
4. Click the **web icon** (`</>`) to add a web app
5. Enter an app nickname (e.g., "Web3 Social Wall")
6. (Optional) Check "Also set up Firebase Hosting" if you plan to deploy
7. Click **"Register app"**
8. You'll see a code snippet with your Firebase configuration
9. **Copy** the `firebaseConfig` object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

10. Click **"Continue to console"**

## Step 4: Add Configuration to Your Project

1. Open your project in your code editor
2. Navigate to `client/src/lib/firebase.ts`
3. Replace the placeholder configuration with your actual config:

```typescript
// BEFORE (placeholder):
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// AFTER (your actual config):
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Your actual API key
  authDomain: "web3-social-wall.firebaseapp.com",
  projectId: "web3-social-wall",
  storageBucket: "web3-social-wall.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

4. Save the file

## Step 5: Verify Firestore Rules

1. In Firebase Console, go to **Firestore Database**
2. Click the **"Rules"** tab at the top
3. You should see test mode rules that look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

4. For development, you can keep these rules
5. For better security, see `firestore.rules.example` in the project root

## Step 6: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the app in your browser at `http://localhost:5000`
3. Connect your MetaMask wallet
4. Navigate to the **Social Wall** page
5. Try creating a post
6. Go back to Firebase Console > Firestore Database
7. You should see a new `posts` collection with your post!

### If you see an error:

**"Permission denied"**
- Check that your Firestore rules allow writes
- Make sure you're in test mode

**"Firebase not configured"**
- Verify you pasted your actual config in `firebase.ts`
- Check for typos in the config object
- Make sure all fields are filled in (no "YOUR_API_KEY" placeholders)

**"Network error"**
- Check your internet connection
- Verify the Firebase project is active in the console

## Optional: Upgrade to Production Rules

Once you've tested the app and want better security:

1. Go to Firebase Console > Firestore Database > Rules
2. Copy the production rules from `firestore.rules.example`
3. Paste them into the rules editor
4. Click **"Publish"**

The production rules will:
- Validate post message length (1-500 characters)
- Validate wallet address format
- Prevent modification of core post fields
- Ensure vote counts stay non-negative

## Security Considerations

⚠️ **Important**: This is a client-only app, which means:

- Users can see your Firebase config (that's okay!)
- The API key is NOT secret - it just identifies your project
- Security comes from Firestore rules, not hiding the config
- Anyone can write data unless you have strict rules

For a production app with real users:
1. Implement Firebase Authentication
2. Use Cloud Functions to verify wallet signatures
3. Set up rate limiting
4. Monitor usage and costs

## Cost Estimates

Firebase has a generous free tier:

**Free tier includes:**
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

**For this demo project:**
- You'll likely stay well within free limits
- Each post creation = 1 write
- Each vote = 1 write
- Each page load = multiple reads (one per post)
- Real-time listeners count as reads

**Estimate**: 100 users creating 5 posts each + 50 votes each = ~750 writes, ~5,000 reads per day (well within free tier)

## Troubleshooting

### "Firebase: Firebase App named '[DEFAULT]' already exists"

This means Firebase was initialized multiple times. To fix:
- Refresh the page
- Make sure you don't have multiple `initializeApp()` calls

### "Quota exceeded"

You've hit Firebase's free tier limits:
- Wait until the next day (quotas reset at midnight Pacific Time)
- Or upgrade to the Blaze (pay-as-you-go) plan

### "Index required" error

Firestore needs an index for your query:
- Click the link in the error message
- Firebase will create the index automatically
- Wait 1-2 minutes for it to build

## Next Steps

Now that Firebase is set up:

1. ✅ Test creating posts
2. ✅ Test liking and disliking
3. ✅ Open the app in two browsers to see real-time updates
4. ✅ Check the Firebase Console to see your data
5. ✅ Share the app with friends to test with multiple users!

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Status](https://status.firebase.google.com/)

Happy building! 🚀
