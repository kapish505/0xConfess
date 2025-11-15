# Web3 Social Wall - Design Guidelines

## Design Approach

**Reference-Based + Modern Web3 Aesthetic**

This project combines Web3 platform conventions (MetaMask, wallet-centric UX) with modern glassmorphism/neumorphism design trends. Draw inspiration from:
- Web3 platforms: Rainbow Wallet, Zapper, Opensea (clean, crypto-native feel)
- Social platforms: Twitter's feed simplicity with Discord's community vibe
- Modern design: Glassmorphism cards with subtle depth and light effects

## Core Visual Language

**Glassmorphism/Neumorphism Aesthetic**
- Frosted glass effects: Semi-transparent backgrounds with backdrop-filter blur
- Subtle elevation: Multiple layers with soft shadows and light borders
- Light refraction: Use gradient borders (1-2px) with subtle color shifts
- Depth without weight: Cards float above background with gentle shadow hierarchy

**Material Hierarchy**
- Base layer: Gradient background (diagonal or radial)
- Mid layer: Glassmorphic containers with 10-20% opacity backgrounds
- Top layer: Interactive elements with stronger contrast and crisp edges

## Typography System

**Font Stack**
- Primary: Inter or DM Sans from Google Fonts
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

**Type Scale**
- Hero headline: text-5xl md:text-6xl lg:text-7xl (bold, 700-800 weight)
- Section headers: text-3xl md:text-4xl (semibold, 600 weight)
- Post content: text-base md:text-lg (regular, 400 weight)
- Wallet addresses: text-sm (mono font, 500 weight)
- Metadata (timestamps): text-xs md:text-sm (light, 300-400 weight)

**Line Height**
- Headlines: leading-tight (1.1-1.2)
- Body text: leading-relaxed (1.6-1.75)
- UI labels: leading-normal (1.5)

## Layout System

**Spacing Primitives**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-4 md:p-6 lg:p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Card gaps: gap-4 md:gap-6
- Button padding: px-6 py-3

**Grid Structure**
- Homepage: Single column max-w-6xl centered
- Social Wall Feed: max-w-3xl centered (mobile), max-w-5xl with sidebar potential (desktop)
- Post cards: Full width on mobile, consider masonry or stacked layout
- About page: max-w-4xl centered

## Component Library

### Header/Navigation
- Sticky header with glassmorphic background (backdrop-blur-lg bg-white/70 dark:bg-gray-900/70)
- Logo on left, nav links center, wallet connection + theme toggle on right
- Wallet address shown as badge with shortened format (0x1234...5678)
- Height: h-16 md:h-20 with proper padding

### Homepage Hero
- Full viewport height section (min-h-screen) with gradient background
- Large headline emphasizing "Web3 Social Wall" concept
- Two CTA buttons: Primary "Connect Wallet" (solid with glow), Secondary "View Wall" (ghost/outline)
- Hero illustration: Abstract geometric shapes or isometric wallet/blockchain visualization
- Subtle floating animation on hero elements

### Social Wall Feed
**Post Cards**
- Glassmorphic cards with rounded-2xl borders
- Each card contains:
  - User avatar (left): Identicon or initials in circular frame (w-10 h-10 md:w-12 h-12)
  - Wallet address (shortened) with copy button
  - Post message (text-base with word-wrap)
  - Metadata row: timestamp (relative format like "2h ago")
  - Action bar: Like/Dislike buttons with counts, positioned at bottom
- Card spacing: space-y-4 md:space-y-6
- Hover state: Subtle lift with shadow increase

**Like/Dislike Buttons**
- Icon + count layout (horizontal)
- Inactive: Ghost style with light border
- Active (user voted): Filled background with accent glow
- Mutually exclusive states (visual toggle)
- Icons: Thumbs up/down or heart/broken-heart

**Post Creation**
- Floating textarea card at top of feed (or modal trigger)
- Glassmorphic input with placeholder "Share your thoughts..."
- Character counter (e.g., 280 max)
- Post button: Prominent, disabled until text entered

### Profile Modal/Drawer
- Slide-in drawer from right (desktop) or bottom sheet (mobile)
- Show: Full wallet address, ENS name if available, list of user's posts
- Disconnect button at bottom (destructive red styling)
- Backdrop overlay with blur

### Theme Toggle
- Sun/moon icon toggle button
- Smooth transition on theme switch (transition-colors duration-200)
- Persists selection

### Toast Notifications
- Top-right corner positioning
- Slide-in animation from right
- Success: Green accent, Checkmark icon
- Error: Red accent, Warning icon
- Auto-dismiss after 3-4 seconds

### Footer
- Dark glassmorphic background
- Three-column layout (desktop): About, Links, Social
- Single column (mobile) with centered text
- Credits for hackathon/demo project

## Interaction Design

**Micro-interactions** (CSS-only)
- Button hover: scale-105 transform with shadow increase
- Button press: scale-95 active state
- Card hover: translateY(-2px) with shadow
- Input focus: Ring with accent color, scale-102
- Like/dislike click: Brief scale-110 then spring back

**Loading States**
- Wallet connection: Pulsing animation on connect button
- Post submission: Spinner on post button, disable inputs
- Feed loading: Skeleton cards with shimmer effect

**Real-time Updates**
- New posts: Fade-in from top with slide animation
- Vote updates: Number counter with brief highlight flash
- Connected users: No persistent indicator, relies on post activity

## Images & Assets

**Hero Section**
Large hero image/illustration showing abstract blockchain/wallet concept:
- Placement: Right side of hero (desktop), above text (mobile)
- Style: Isometric 3D wallet, floating crypto symbols, or gradient abstract shapes
- Format: SVG for scalability
- Colors: Match gradient theme with accent highlights

**Icons** (Inline SVG via Heroicons)
- Wallet icon (navbar)
- Like/Dislike (thumbs or hearts)
- Copy icon (address copy)
- Sun/Moon (theme toggle)
- Check/Error (toasts)
- External link (footer socials)

**Avatars**
Client-side generated identicons or initial circles from wallet address

## Accessibility

- All buttons: Clear focus rings with 2px offset
- Interactive elements: Minimum 44x44px touch target
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Keyboard navigation: Tab order through feed, modal focus trap
- ARIA labels: "Connect wallet button", "Like post by 0x1234...", "Post message input"
- Screen reader text for icon-only buttons

## Responsive Behavior

**Breakpoints**
- Mobile: < 768px (base styles)
- Tablet: 768px - 1024px (md:)
- Desktop: > 1024px (lg:)

**Mobile Adjustments**
- Single column feed
- Stacked nav (hamburger menu if needed)
- Bottom sheet modals instead of side drawers
- Larger touch targets (p-4 instead of p-3)
- Reduced text sizes by one step

## Performance Considerations

- Glassmorphism sparingly: Only on main cards and header
- Limit backdrop-filter usage to avoid performance issues
- Virtual scrolling consideration for feed with 100+ posts
- Lazy load posts as user scrolls
- Optimize SVG assets (inline critical icons, load others on demand)