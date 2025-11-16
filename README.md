# 0xConfess 🔥

An anonymous Web3 confession platform where users connect with MetaMask, share confessions, and engage with AI-powered spice ratings. Built with React, Firebase Firestore, and modern Web3 technologies.

![0xConfess](https://img.shields.io/badge/0xConfess-Web3-blueviolet) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![MetaMask](https://img.shields.io/badge/MetaMask-Enabled-f6851b) ![React](https://img.shields.io/badge/React-18.3-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- **🔐 MetaMask Wallet Connection**: Secure wallet-based authentication
- **📝 Anonymous Confessions**: Share confessions tied to your wallet address
- **🔥 AI-Powered Spice Ratings**: AI evaluates confessions on a 1-5 scale based on engagement and content
- **👍👎 Like/Dislike System**: Engage with confessions through voting
- **💬 Comments**: Add comments to confessions
- **⚡ Real-time Updates**: See new confessions, votes, and comments instantly with Firebase
- **🎨 Modern UI**: Beautiful interface built with Shadcn UI and Tailwind CSS
- **🌓 Dark/Light Mode**: Theme toggle with localStorage persistence
- **📱 Responsive Design**: Mobile-first, works beautifully on all devices
- **👤 User Profiles**: View your confessions and wallet details
- **🚀 Vercel Ready**: Pre-configured for easy deployment

## 🚀 Quick Start

### Prerequisites

- **MetaMask Extension**: [Install MetaMask](https://metamask.io/download/) for your browser
- **Firebase Account**: [Create a free Firebase account](https://firebase.google.com/)
- **Node.js**: Version 18 or higher
- **OpenAI API Key** (optional): For AI-powered spice ratings

### Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/kapish505/SocialWall.git
   cd SocialWall
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

4. **Get your Firebase configuration:**
   
   a. In Firebase Console, go to **Project Settings** (gear icon)
   
   b. Scroll down to **Your apps** section
   
   c. Click the web icon `</>` to add a web app
   
   d. Register your app with a nickname (e.g., "0xConfess")
   
   e. Copy the `firebaseConfig` object

5. **Add Firebase config to your project:**
   
   Edit `client/src/lib/firebase.js` and replace the `firebaseConfig` object with your actual Firebase config:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```
   
   **⚠️ IMPORTANT**: Replace all the placeholder values with your actual Firebase config!

6. **Set up OpenAI API (Optional):**
   
   For AI-powered spice ratings, set the `OPENAI_API_KEY` environment variable:
   
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```
   
   Or create a `.env` file:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```
   
   **Note**: If not set, the app will use fallback engagement-based scoring.

7. **Run the application:**
   
   Start the development server:
   ```bash
   npm run dev
   ```

8. **Open the app** in your browser at `http://localhost:5000` and connect your MetaMask wallet!
   
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

### Creating a Confession

1. Make sure your wallet is connected
2. Navigate to the **Confess** page (`/confess`)
3. Type your confession in the text area
4. Click **"Post"** to share with the community
5. The AI will automatically evaluate the spice level (1-5) based on engagement

### AI Spice Ratings

Confessions are automatically rated on a 1-5 scale:
- **1 - Mild**: Low engagement, standard content
- **2 - Spicy**: Moderate engagement
- **3 - Very Spicy**: High engagement
- **4 - Wild**: Very high engagement
- **5 - Nuclear**: Maximum engagement

The rating is calculated using:
- AI analysis of content and engagement (if OpenAI API key is set)
- Fallback: Engagement-based scoring: `(likes * 2 + dislikes + comments * 1.5) / 10 + 1`

### Liking and Disliking Confessions

- Click the 👍 button to like a confession
- Click the 👎 button to dislike a confession
- You can switch your vote by clicking the other button
- Click the same button again to remove your vote
- You cannot vote on your own confessions

### Adding Comments

- Click on a confession to view comments
- Type your comment and click **"Post Comment"**
- Comments update the spice rating in real-time

### Viewing Your Profile

1. Click on your wallet address in the header
2. A profile modal will appear showing:
   - Your full wallet address
   - Link to view your address on Etherscan
   - All your confessions
3. Click **"Disconnect Wallet"** to log out

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **JavaScript (ES6+)** - Programming language
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library (Radix UI primitives)
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon system
- **Framer Motion** - Animation library

### Backend
- **Express.js** - Web server framework
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase SDK v12+** - Modern modular SDK
- **Serverless HTTP** - For Vercel serverless functions

### Web3
- **MetaMask** - Wallet connection
- **Ethers.js** - Ethereum library (via MetaMask)

### AI
- **OpenAI API** - GPT-3.5-turbo for spice evaluation
- **Fallback Algorithm** - Engagement-based scoring

### Deployment
- **Vercel** - Hosting and serverless functions
- **Node.js 20.x** - Runtime environment

## 📁 Project Structure

```
0xConfess/
├── api/
│   └── index.js              # Vercel serverless function wrapper
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── Header.jsx    # Navigation header
│   │   │   ├── Footer.jsx    # Site footer
│   │   │   ├── PostCard.jsx  # Confession display
│   │   │   ├── CreatePost.jsx # Confession creation form
│   │   │   ├── ProfileModal.jsx # User profile modal
│   │   │   ├── SpiceMeter.jsx # Spice rating display
│   │   │   └── ConfessComments.jsx # Comments component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx  # Landing page
│   │   │   ├── ConfessPage.jsx # Main confessions feed
│   │   │   ├── AboutPage.jsx # About/info page
│   │   │   └── not-found.jsx # 404 page
│   │   ├── lib/
│   │   │   ├── firebase.js    # Firebase initialization
│   │   │   ├── firestore.js   # Firestore operations
│   │   │   ├── wallet.js      # MetaMask utilities
│   │   │   ├── ai.js          # AI spice evaluation
│   │   │   ├── theme.jsx     # Dark/light mode
│   │   │   └── queryClient.js # TanStack Query setup
│   │   ├── hooks/
│   │   │   ├── use-toast.js  # Toast notifications
│   │   │   └── use-mobile.jsx # Mobile detection
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # App entry point
│   │   └── index.css         # Global styles
│   └── index.html            # HTML template
├── server/
│   ├── index.js              # Express server (dev)
│   ├── routes.js              # API routes
│   └── vite.js                # Vite middleware
├── shared/
│   └── schema.js              # Shared data schemas
├── vercel.json                # Vercel configuration
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies
└── README.md                   # This file
```

## 🔌 API Endpoints

### POST `/api/evaluate-spice`

Evaluates the spice level of a confession based on content and engagement.

**Request Body:**
```json
{
  "message": "Your confession text",
  "engagement": {
    "likes": 10,
    "dislikes": 2,
    "comments": 5
  }
}
```

**Response:**
```json
{
  "score": 4,
  "label": "Wild",
  "fallback": false
}
```

**Note**: Requires `OPENAI_API_KEY` environment variable for AI evaluation. Falls back to engagement-based scoring if not set.

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **"Add New Project"**
   - Import your Git repository
   - Vercel will auto-detect settings from `vercel.json`

3. **Configure Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add `OPENAI_API_KEY` (optional but recommended)
   - Add for Production, Preview, and Development environments

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete
   - Your app will be live!

**Configuration:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Node.js Version**: 20.x

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

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

See `firestore.rules.example` for production-ready security rules.

## ⚠️ Common Issues

### MetaMask Not Detected

**Problem**: "MetaMask not installed" error

**Solution**: 
- Install the [MetaMask browser extension](https://metamask.io/download/)
- Refresh the page after installation
- Make sure you're not in a private/incognito window

### Firebase Permission Denied

**Problem**: "Missing or insufficient permissions" error

**Solution**:
- Check that your Firestore database is in **test mode** (for development)
- Verify your Firebase config is correct in `client/src/lib/firebase.js`
- Check the browser console for detailed error messages

### Confessions Not Appearing

**Problem**: Confessions don't show up after creation

**Solution**:
- Open browser DevTools (F12) and check the Console for errors
- Verify Firebase is properly configured
- Check that the Firestore database exists and is accessible
- Ensure real-time listeners are properly set up

### AI Spice Rating Not Working

**Problem**: Spice ratings show fallback scores

**Solution**:
- Check that `OPENAI_API_KEY` is set in environment variables
- Verify the API key is valid
- Check server logs for API errors
- The app will use fallback scoring if OpenAI API is unavailable

### Build Fails on Vercel

**Problem**: Deployment fails

**Solution**:
- Check build logs in Vercel dashboard
- Verify `outputDirectory` is set to `dist/public` in Vercel settings
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

## 🧪 Testing Locally

### Test with Multiple Wallets

1. Open the app in your main browser
2. Connect with your primary MetaMask wallet
3. Open the app in an incognito/private window
4. Connect with a different MetaMask account
5. Test posting and voting between the two accounts
6. Verify real-time updates appear in both windows

### Common Test Scenarios

- ✅ Connect wallet → Create confession → See it appear
- ✅ Like a confession → Unlike it → Like again
- ✅ Like a confession → Switch to dislike → Remove dislike
- ✅ Add comment → See spice rating update
- ✅ Create multiple confessions → View them in profile
- ✅ Disconnect wallet → Reconnect → Profile persists
- ✅ Toggle dark/light mode → Preference persists on reload

## 📄 License

This project is open source and available under the MIT License.

## 💜 Acknowledgments

- Built with 💜 for the Web3 community
- Inspired by the vision of decentralized social media
- Created as a hackathon demonstration project
- Thanks to the teams behind MetaMask, Firebase, React, and Vercel

## 📞 Support

Need help? Have questions?

- 📧 Open an issue on [GitHub](https://github.com/kapish505/SocialWall)
- 📖 Check the documentation in `FIREBASE_SETUP.md` and `VERCEL_DEPLOYMENT.md`

---

**Happy Confessing! Welcome to 0xConfess!** 🔥
