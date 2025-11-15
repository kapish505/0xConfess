# Web3 Social Wall 🌐

A decentralized social platform where users connect with MetaMask, post messages, and engage with the Web3 community through likes and dislikes. Built with React, TypeScript, Firebase Firestore, and modern Web3 technologies.

![Web3 Social Wall](https://img.shields.io/badge/Web3-Social-blueviolet) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![MetaMask](https://img.shields.io/badge/MetaMask-Enabled-f6851b)

## ✨ Features

- **🔐 MetaMask Wallet Connection**: Secure wallet-based authentication
- **📝 Create Posts**: Share messages with the decentralized community
- **👍👎 Like/Dislike System**: Engage with posts through voting
- **⚡ Real-time Updates**: See new posts and votes instantly with Firebase
- **🎨 Glassmorphism UI**: Modern, beautiful interface with smooth animations
- **🌓 Dark/Light Mode**: Theme toggle with localStorage persistence
- **📱 Responsive Design**: Mobile-first, works beautifully on all devices
- **🔒 Transaction-Safe Voting**: Firestore transactions prevent race conditions
- **👤 User Profiles**: View your posts and wallet details
- **🎯 ENS Support**: Display ENS names when available (optional)

## 🚀 Quick Start

### Prerequisites

- **MetaMask Extension**: [Install MetaMask](https://metamask.io/download/) for your browser
- **Firebase Account**: [Create a free Firebase account](https://firebase.google.com/)
- **Node.js**: Version 18 or higher

### Installation

1. **Clone this repository:**
   ```bash
   git clone <repository-url>
   cd SocialWall_-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase Firestore:**

   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project or select an existing one
   
   c. Navigate to **Build → Firestore Database**
   
   d. Click **Create database**
   
   e. Choose **Start in test mode** (for development)
   
   f. Select your preferred region and click **Enable**

3. **Get your Firebase configuration:**

   a. In Firebase Console, go to **Project Settings** (gear icon)
   
   b. Scroll down to **Your apps** section
   
   c. Click the web icon `</>` to add a web app
   
   d. Register your app with a nickname (e.g., "Web3 Social Wall")
   
   e. Copy the `firebaseConfig` object

4. **Add Firebase config to your project:**

   Create a file `client/src/lib/firebase.ts` with this content:

   ```typescript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   // TODO: Replace with your Firebase config
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

   **⚠️ IMPORTANT**: Replace all the placeholder values with your actual Firebase config!

5. **Run the application:**

   Start the development server:
   ```bash
   npm run dev
   ```

6. **Open the app** in your browser at `http://localhost:5000` and connect your MetaMask wallet!

   **Note**: The app runs on port 5000 by default. You can change this by setting the `PORT` environment variable:
   ```bash
   PORT=3000 npm run dev
   ```

## 📖 Usage Guide

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button in the header
2. MetaMask will prompt you to connect your wallet
3. Select the account you want to use and approve the connection
4. Your wallet address will appear in the header

### Creating a Post

1. Make sure your wallet is connected
2. Navigate to the **Social Wall** page
3. Type your message in the text area (max 500 characters)
4. Click **"Post"** to share with the community

### Liking and Disliking Posts

- Click the 👍 button to like a post
- Click the 👎 button to dislike a post
- You can switch your vote by clicking the other button
- Click the same button again to remove your vote
- You cannot vote on your own posts

### Viewing Your Profile

1. Click on your wallet address in the header
2. A profile modal will appear showing:
   - Your full wallet address
   - Link to view your address on Etherscan
   - All your posts
3. Click **"Disconnect Wallet"** to log out

## 🔒 Firestore Security Rules

### Development (Test Mode)

For initial development and testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: This allows anyone to read/write data. Only use for development!

### Production (Recommended)

For a more secure setup:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read posts
    match /posts/{postId} {
      allow read: if true;
      
      // Allow writes only if address field matches the request (basic check)
      allow create: if request.resource.data.address is string &&
                      request.resource.data.message is string &&
                      request.resource.data.message.size() <= 500 &&
                      request.resource.data.timestamp is number;
      
      // Allow updates for voting (simplified - doesn't verify signatures)
      allow update: if request.resource.data.keys().hasOnly([
        'likes', 'dislikes', 'likedBy', 'dislikedBy', 
        'address', 'message', 'timestamp', 'signature', 'ensName'
      ]);
      
      // Delete only by original poster (basic check by address field)
      allow delete: if resource.data.address == request.auth.uid;
    }
  }
}
```

### 🔐 Important Security Notes

**Signature Verification Limitation:**

This is a **client-only** demo project. Firestore security rules **cannot verify cryptographic signatures** (like those from MetaMask) without server-side code.

In the current implementation:
- Message signing is used as a **UX feature** to prove intent
- The signature is stored with the post but not cryptographically verified server-side
- Firestore rules can only check basic field types and sizes

**For Production:**

To properly verify wallet signatures, you need:

1. **Firebase Cloud Functions** to verify signatures server-side:
   ```javascript
   const { recoverPersonalSignature } = require('@metamask/eth-sig-util');
   
   functions.https.onCall(async (data, context) => {
     const { message, signature, address } = data;
     const recoveredAddress = recoverPersonalSignature({
       data: message,
       signature: signature,
     });
     
     if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
       throw new functions.https.HttpsError('permission-denied', 'Invalid signature');
     }
     // Create post in Firestore
   });
   ```

2. **Firebase Authentication** to tie wallet addresses to authenticated users

3. Update security rules to require authentication:
   ```javascript
   allow create: if request.auth != null && request.auth.uid == request.resource.data.address;
   ```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling system
- **Wouter** - Client-side routing
- **TanStack Query** - Data fetching (configured for Firebase)
- **Shadcn UI** - Component library
- **Lucide React** - Icon system

### Web3
- **MetaMask** - Wallet connection
- **Ethers.js** - Ethereum library (optional, for advanced features)

### Backend
- **Firebase Firestore** - Real-time database
- **Firebase SDK v10+** - Modern modular SDK

### Design
- **Inter Font** - Primary typography
- **Space Mono** - Monospace for wallet addresses
- **Glassmorphism** - Modern UI aesthetic
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
web3-social-wall/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   ├── PostCard.tsx     # Individual post display
│   │   │   ├── CreatePost.tsx   # Post creation form
│   │   │   └── ProfileModal.tsx # User profile modal
│   │   ├── pages/
│   │   │   ├── HomePage.tsx     # Landing page
│   │   │   ├── SocialWallPage.tsx # Main feed
│   │   │   └── AboutPage.tsx    # About/info page
│   │   ├── lib/
│   │   │   ├── firebase.ts      # Firebase initialization (YOU MUST CREATE THIS)
│   │   │   ├── wallet.ts        # MetaMask utilities
│   │   │   ├── theme.tsx        # Dark/light mode
│   │   │   └── queryClient.ts   # TanStack Query setup
│   │   ├── App.tsx              # Main app component
│   │   └── index.css            # Global styles
│   └── index.html               # HTML template
├── shared/
│   └── schema.ts                # TypeScript types
└── README.md                    # This file
```

## 🧪 Testing Locally

### Test with Multiple Wallets

1. Open the app in your main browser
2. Connect with your primary MetaMask wallet
3. Open the app in an incognito/private window
4. Connect with a different MetaMask account
5. Test posting and voting between the two accounts
6. Verify real-time updates appear in both windows

### Common Test Scenarios

- ✅ Connect wallet → Create post → See it appear
- ✅ Like a post → Unlike it → Like again
- ✅ Like a post → Switch to dislike → Remove dislike
- ✅ Create multiple posts → View them in profile
- ✅ Disconnect wallet → Reconnect → Profile persists
- ✅ Toggle dark/light mode → Preference persists on reload

## ⚠️ Common Issues

### MetaMask Not Detected

**Problem**: "MetaMask not installed" error

**Solution**: 
- Install the [MetaMask browser extension](https://metamask.io/download/)
- Refresh the page after installation
- Make sure you're not in a private/incognito window (extensions may be disabled)

### Firebase Permission Denied

**Problem**: "Missing or insufficient permissions" error

**Solution**:
- Check that your Firestore database is in **test mode**
- Verify your Firebase config is correct in `client/src/lib/firebase.ts`
- Check the browser console for detailed error messages

### Posts Not Appearing

**Problem**: Posts don't show up after creation

**Solution**:
- Open browser DevTools (F12) and check the Console for errors
- Verify Firebase is properly configured
- Check that the Firestore database exists and is accessible
- Ensure real-time listeners are properly set up in the code

### Voting Not Working

**Problem**: Likes/dislikes don't update

**Solution**:
- Make sure your wallet is connected
- You cannot vote on your own posts
- Check for JavaScript errors in the browser console
- Verify Firestore transactions are working

## 🎯 Roadmap

### Phase 1 ✅ (Current)
- [x] MetaMask wallet connection
- [x] Post creation and display
- [x] Like/dislike system
- [x] Real-time updates
- [x] Dark/light mode
- [x] Responsive design

### Phase 2 🚧 (Future)
- [ ] ENS name resolution
- [ ] Comment/reply system
- [ ] Post editing and deletion
- [ ] User profiles with avatars
- [ ] Search and filter posts
- [ ] Trending posts algorithm

### Phase 3 🔮 (Long-term)
- [ ] IPFS integration for decentralized storage
- [ ] NFT profile pictures
- [ ] Token-gated communities
- [ ] On-chain voting with smart contracts
- [ ] Multi-chain support (Polygon, etc.)

## 🤝 Contributing

This is a hackathon demo project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 💜 Acknowledgments

- Built with 💜 for the Web3 community
- Inspired by the vision of decentralized social media
- Created as a hackathon demonstration project
- Thanks to the teams behind MetaMask, Firebase, and React

## 📞 Support

Need help? Have questions?

- 📧 Open an issue on GitHub
- 💬 Join our Discord community
- 🐦 Follow us on Twitter

---

## 0xConfess — Static Demo (ES Modules + Firestore + AI)

A lightweight client-only demo implementing an anonymous confession board with engagement-based AI spice scoring.

### Demo Features

- **Engagement-Based Spice Meter**: AI rates posts 1–5 based on likes, dislikes, and comments (not message length).
- **Auto Recalc**: Spice score updates in real-time when users like/dislike or comment.
- **Trending Posts**: Top 5 sidebar ranked by total engagement (likes*2 + dislikes + comments*1.5).
- **Top Users**: Most Active Users ranked by (postsCount*3 + likesReceived*2).
- **Real-time Firestore**: Comments, votes, and AI updates sync live.
- **Responsive Sidebar**: Fixed on desktop, collapsible on mobile.

### Quick Start (Local Demo)

1. **Serve the static files** from project root:
   ```bash
   cd /Users/kapish/Work/SocialWall\ 2
   python3 -m http.server 3000
   ```

2. **Open in browser**:
   - Home: http://localhost:3000/client/index_confess.html
   - Wall: http://localhost:3000/client/wall.html

3. **Set up Firebase config**:
   - Edit `client/js/firestore.js` line ~7 and replace `DEFAULT_FIREBASE_CONFIG` with your Firebase project credentials.

4. **Set up OpenAI API** (already configured):
   - OpenAI API key is injected in `client/js/ai.js` line 2 (read-only for demo).

### How It Works

**Spice Scoring Algorithm**:
```javascript
// On like/dislike/comment change:
await evaluateSpice(message, {
  likes: post.likes,
  dislikes: post.dislikes,
  comments: post._commentCount
});
// Returns {score: 1–5, label: "Mild" | "Spicy" | "Very Spicy" | "Wild" | "Nuclear"}
```

**Trending Posts Ranking**:
```javascript
engagementScore = (likes * 2) + (dislikes) + (comments * 1.5)
// Top 5 posts sorted by engagementScore descending
```

**Top Users Ranking**:
```javascript
activityScore = (postsCount * 3) + (likesReceived * 2)
// Top 5 users sorted by activityScore descending
```

### Firestore Schema (0xConfess)

**Collection: `posts`**
```json
{
  "message": "string",
  "address": "0x...",           // lowercase wallet
  "timestamp": 1700000000000,
  "likes": 5,
  "dislikes": 1,
  "likedBy": ["0x...", "0x..."],
  "dislikedBy": ["0x..."],
  "spiceScore": 4,              // 1–5 integer
  "spiceLabel": "Wild",
  "lastSpiceEval": 1700001000000,
  "_commentCount": 3
}
```

**Subcollection: `posts/{postId}/comments`**
```json
{
  "message": "string",
  "address": "0x...",           // lowercase
  "timestamp": 1700000500000
}
```

**Collection: `anonActivity`**
```json
{
  "anonId": "Anon #4821",
  "addressHash": "a1b2c3d4...",
  "postsCount": 7,
  "likesReceived": 24,
  "commentsReceived": 5,
  "lastUpdated": 1700001000000,
  "activityScore": 72           // postsCount*3 + likesReceived*2
}
```

**Collection: `aiCache`**
```json
{
  "top5": {
    "items": [{...post docs...}],
    "lastUpdated": 1700001000000
  }
}
```

### Security & Production Recommendations

⚠️ **Important**: This demo exposes your OpenAI API key in client code. **Never deploy this to production.** Instead:

1. **Create a serverless function** to proxy AI calls:
   - Firebase Cloud Function or Vercel Serverless Function
   - Store API key as an environment variable (server-side only)
   - Client calls the serverless function endpoint instead

2. **Example Vercel Function** (`api/ai.js`):
   ```javascript
   export default async (req, res) => {
     const { text, likes, dislikes, comments } = req.body;
     const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
       },
       body: JSON.stringify({
         model: 'gpt-3.5-turbo',
         messages: [{
           role: 'user',
           content: `Rate spiciness (1-5) for: "${text}" (${likes}👍 ${dislikes}👎 ${comments}💬). Return JSON: {"score":int,"label":"string"}`
         }],
         max_tokens: 60,
         temperature: 0.2
       })
     });
     const data = await response.json();
     res.json(data);
   };
   ```

3. **Update client** (`client/js/ai.js`):
   ```javascript
   export async function evaluateSpice(text, engagement={}) {
     const res = await fetch('/api/ai', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({text, ...engagement})
     });
     return res.json();
   }
   ```

### Testing the Demo

1. **Connect MetaMask** (or use test account).
2. **Create a post** — spice score generated instantly.
3. **Like/dislike** — spice score recalculates based on new engagement.
4. **Add comment** — post's comment count increases, spice re-evaluates.
5. **Watch sidebar** — Top 5 and Most Active Users update in real-time.

### Troubleshooting

- **Firebase errors**: Verify your Firebase config in `client/js/firestore.js`.
- **AI errors**: Check that OpenAI API key is valid (visible in browser console).
- **MetaMask**: Ensure you're on a supported network and connected.
- **Sidebar not updating**: Check browser console for Firestore or AI errors.

---

**Happy Building! Welcome to Web3!** 🚀
# SocialWall_
# SocialWall
