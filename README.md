# 💰 xpense - iOS-Style Expense Tracker

A beautifully designed expense tracking application that **strictly follows Apple's iOS Human Interface Guidelines**, powered by Google's Gemini AI. Track your expenses, scan receipts, and get personalized financial insights—all while keeping your data private and secure on your device.

![iOS Design](https://img.shields.io/badge/Design-iOS%20HIG-007AFF?style=for-the-badge&logo=apple)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Capacitor](https://img.shields.io/badge/Capacitor-7.4-119EFF?style=for-the-badge&logo=capacitor)

## ✨ Features

### Core Functionality
- 💸 **Transaction Management** - Track both expenses and income with detailed categorization
- 📊 **Real-time Dashboard** - View balance, income, and spending at a glance
- 📈 **Interactive Charts** - Pie charts for category breakdown and bar charts for activity trends
- 🏷️ **Smart Categories** - 8 predefined categories (Food, Transport, Shopping, Utilities, Entertainment, Health, Income, Other)
- 📅 **Date Tracking** - Organize transactions by date with full history

### AI-Powered Features (Gemini 2.5 Flash)
- 🤖 **Financial Insights** - Get personalized spending analysis and money-saving tips in your currency
- 📸 **Receipt Scanning** - Extract merchant, amount, date, and category from receipt photos with automatic currency conversion
- 🏷️ **Auto-categorization** - AI suggests the most appropriate category based on transaction description and regional patterns
- 💡 **Smart Suggestions** - Contextual financial advice based on your spending patterns
- 💱 **Multi-Currency Support** - AI automatically converts foreign currency receipts to your preferred currency using real-time exchange rates

### Design & UX
- 📱 **iOS-Native Feel** - Pixel-perfect implementation of Apple's Human Interface Guidelines
- 🎨 **Dark Mode First** - Beautiful dark theme optimized for OLED displays
- 🌊 **Smooth Animations** - Native iOS-style transitions and gestures
- 📱 **Responsive Layout** - Optimized for iPhone, iPad, and macOS with adaptive UI
- 🎯 **Touch-Optimized** - 44px minimum touch targets, haptic feedback simulation
- 🔄 **Onboarding Flow** - Beautiful 4-card carousel introducing app features

### Privacy & Performance
- 🔒 **Privacy First** - All data stored locally in browser localStorage
- ⚡ **Lightning Fast** - Optimized with lazy loading, code splitting, and GPU acceleration
- 📦 **Offline Ready** - Works completely offline (except AI features)
- 🎯 **Zero Tracking** - No analytics, no data collection, no external servers

## 📸 Screenshots

> **Note:** Add screenshots here to showcase the app's beautiful iOS design

**Onboarding Flow:**
- 4-card carousel with smooth scroll snap
- Gradient app icon with blur effects
- Feature pills and checkmarks
- API key input with security notice

**Dashboard:**
- Balance, Income, and Spending cards
- Interactive pie chart (category breakdown)
- Bar chart (activity over time)
- iOS-style navigation with large titles

**Transaction Form:**
- Large calculator-style amount input
- Receipt scanning button
- Segmented control (Expense/Income)
- iOS-style grouped list
- Right-aligned values

**Transaction List:**
- Swipe-to-delete actions
- Category icons and colors
- Date grouping
- Empty state with illustration

**AI Insights:**
- Purple gradient card (Apple Music style)
- Markdown-formatted tips
- Loading spinner with message
- Update analysis button

**Settings:**
- API key management
- Clear data with confirmation
- iOS-style list items

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager (comes with Node.js)
- **Gemini API Key** - For AI features ([Get one free here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/xpense.git
   cd xpense
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set your Gemini API key (Optional):**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Or add it later through the onboarding flow or Settings page.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

The app will open with an onboarding flow where you can optionally add your Gemini API key to enable AI features.

### First-Time Setup

On first launch, you'll see a beautiful 4-card onboarding carousel:
1. **Welcome** - Introduction to xpense with feature pills
2. **Track Transactions** - Learn about expense tracking with checkmarks
3. **Beautiful Insights** - Discover data visualization with mock chart
4. **AI Features** - Optional Gemini API key setup with secure storage info

You can skip the API key setup and add it later in Settings. The app works perfectly without AI features—you just won't have receipt scanning, auto-categorization, or financial insights.

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Gemini AI API Key (optional - can be added via UI)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** The API key can also be added through:
- Onboarding flow (4th card)
- Settings page (anytime)

The app checks for the API key in this order:
1. localStorage (`xpense-api-key`)
2. Environment variable (`GEMINI_API_KEY`)

If no key is found, AI features show helpful error messages.

## 💡 Feature Deep Dive

### Transaction Management

**Categories Available:**
- 🍔 **Food** - Restaurants, groceries, dining
- 🚗 **Transport** - Fuel, parking, public transit
- 🛍️ **Shopping** - Clothes, electronics, general shopping
- 💡 **Utilities** - Electricity, water, internet, phone
- 🎬 **Entertainment** - Movies, games, subscriptions
- 🏥 **Health** - Medical, pharmacy, fitness
- 💰 **Income** - Salary, freelance, gifts
- 📦 **Other** - Everything else

**Transaction Properties:**
- Amount (decimal, 2 places)
- Description (required)
- Category (dropdown)
- Date (date picker)
- Type (Expense/Income toggle)
- ID (auto-generated UUID)

### Dashboard Analytics

**Summary Cards:**
- **Balance** - Income minus expenses (can be negative)
- **Income** - Total of all income transactions (green)
- **Spending** - Total of all expense transactions (red)

**Expense Breakdown (Pie Chart):**
- Shows percentage by category
- Interactive tooltips with exact amounts
- iOS system colors for each category
- Only shows categories with transactions

**Activity Chart (Bar Chart):**
- Last 7 days of activity
- Stacked bars (income + expenses)
- Hover tooltips with date and amounts
- Responsive to screen size

### AI Features (Gemini 2.5 Flash)

**Receipt Scanning:**
- **Input:** Photo of receipt (JPEG, PNG, etc.)
- **Processing:** Gemini Vision API analyzes image
- **Output:** Merchant name, total amount, date, suggested category
- **Accuracy:** Works best with clear, well-lit receipts
- **Currency:** Supports 10 currencies (USD, EUR, GBP, JPY, CNY, INR, CAD, AUD, CHF, KRW)
- **Auto-Conversion:** Automatically converts foreign currency receipts to your preferred currency
- **Real-Time Exchange Rates:** Uses Google Search grounding to fetch live exchange rates for accurate conversion
- **Date Format:** Returns date in your preferred format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)

**Financial Insights:**
- **Analysis:** Reviews all transactions with context (total income, expenses, balance)
- **Output:** 3 personalized money-saving tips in your currency
- **Tone:** Friendly, encouraging (Apple-style)
- **Format:** Markdown with bullets and emphasis
- **Currency-Aware:** Uses your currency symbol and considers regional spending patterns
- **Date-Aware:** Formats dates according to your preference
- **Refresh:** Can regenerate anytime with updated data

**Smart Categorization:**
- **Input:** Transaction description
- **Processing:** Natural language understanding with regional context
- **Output:** Best-fit category from 8 options
- **Context-Aware:** Considers common spending patterns in your currency region
- **Fallback:** "Other" if uncertain
- **Speed:** Near-instant response

### Performance Features

**Lazy Loading:**
- Dashboard, Transactions, Insights, Settings, Onboarding
- Loaded on-demand when tab is clicked
- Suspense fallback with spinner
- Reduces initial bundle size

**Memoization:**
- Dashboard component (React.memo)
- Expensive calculations (useMemo)
- Callback functions (useCallback)
- Prevents unnecessary re-renders

**Virtual Lists:**
- Only visible transactions rendered
- Smooth scrolling with thousands of items
- Content visibility: auto
- Layout containment

**GPU Acceleration:**
- All animations use transform and opacity
- translate3d(0, 0, 0) for hardware acceleration
- backface-visibility: hidden
- will-change during animations only

**Code Splitting:**
- React vendor chunk (React + ReactDOM)
- Charts chunk (Recharts)
- AI chunk (Google Gemini SDK)
- Icons chunk (Lucide React)
- Lazy loaded on demand

## 📖 How to Use

### Adding Transactions

1. **Click the + button** in the tab bar (mobile) or sidebar (desktop)
2. **Enter the amount** - Large calculator-style input
3. **Choose type** - Expense or Income (segmented control)
4. **Add title** - Description of the transaction
5. **Select category** - 8 categories to choose from
6. **Pick date** - Defaults to today
7. **Tap "Add Transaction"**

### Scanning Receipts (AI Feature)

1. **Click "Scan Receipt"** in the transaction form
2. **Take a photo** or select from gallery
3. **Wait for AI analysis** - Gemini extracts data
4. **Review and edit** - Auto-filled amount, merchant, date, category
5. **Save transaction**

Works best with clear, well-lit receipt photos. Supports Indian Rupee (₹) receipts.

### Viewing Dashboard

The Overview tab shows:
- **Balance Card** - Total balance (income - expenses)
- **Income Card** - Total income with green indicator
- **Spending Card** - Total expenses with red indicator
- **Expense Breakdown** - Pie chart by category
- **Activity Chart** - Bar chart of recent transactions

All charts are interactive with tooltips showing exact values.

### Getting AI Insights (AI Feature)

1. **Go to "For You" tab**
2. **Tap "Analyze My Spending"**
3. **Wait for AI analysis** - Gemini reviews your transactions
4. **Read personalized tips** - 3 actionable money-saving suggestions
5. **Tap "Update Analysis"** to refresh

Insights are based on your actual spending patterns and are regenerated each time.

### Managing Settings

In the Settings tab:
- **API Key** - Add or update your Gemini API key
- **Clear Data** - Delete all transactions (with confirmation)
- **App Info** - Version and credits

## 📱 Building for Android

This project uses **Capacitor** for native Android builds with automated GitHub Actions.

### Automated Builds (GitHub Actions)

Every push to `main` automatically triggers a build workflow that:
- ✅ Installs dependencies with npm ci
- ✅ Builds the web app with Vite
- ✅ Adds Android platform with Capacitor
- ✅ Syncs web assets to Android project
- ✅ Sets up JDK 21 and Android SDK
- ✅ Compiles the Android APK with Gradle
- ✅ Uploads the APK as a downloadable artifact

**Download your APK:**
1. Go to the [Actions tab](https://github.com/iambhvsh/xpense/actions) on GitHub
2. Click on the latest workflow run (green checkmark)
3. Scroll to "Artifacts" section
4. Download the `app-debug` artifact (ZIP file)
5. Extract and install the APK on your Android device

### Local Development

**Prerequisites:**
- **Android Studio** - Latest stable version
- **JDK 21** - Java Development Kit
- **Android SDK** - API Level 34+ recommended

**Build locally:**
```bash
npm run android
```

This will:
1. Build your web app with Vite
2. Sync web assets with Capacitor
3. Open Android Studio for testing

**Manual APK build:**
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync android

# Build APK with Gradle
cd android
./gradlew assembleDebug

# Or for release build
./gradlew assembleRelease
```

The APK will be in:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### Testing on Device

1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect via USB**
4. **Run from Android Studio** or use:
   ```bash
   cd android
   ./gradlew installDebug
   ```

### Troubleshooting Android Builds

**Gradle build fails:**
- Ensure JDK 21 is installed and set as JAVA_HOME
- Clear Gradle cache: `cd android && ./gradlew clean`
- Invalidate Android Studio caches

**Capacitor sync issues:**
- Delete `android/` folder and re-add: `npx cap add android`
- Check `capacitor.config.ts` for correct webDir: 'dist'

**APK not installing:**
- Enable "Install from Unknown Sources" on your device
- Check minimum SDK version (API 22+)

## 🎨 iOS Design System

This app has been **completely redesigned** to match iOS design standards with pixel-perfect accuracy. Every component, animation, and interaction follows Apple's Human Interface Guidelines.

### Design Principles Applied

✅ **SF Pro Font Family** - Apple's system font stack (-apple-system, BlinkMacSystemFont)  
✅ **iOS Color Palette** - Exact system colors (Blue #007AFF, Green #34C759, Red #FF3B30, etc.)  
✅ **iOS Typography Scale** - Large Title (34px), Title 1-3, Headline, Body, Callout, Subheadline, Footnote, Caption  
✅ **iOS Border Radius** - Small (10px), Medium (12px), Large (14px), XLarge (20px), Cards (28px)  
✅ **iOS Shadows** - Subtle elevation system matching iOS depth  
✅ **iOS Animations** - Native-feeling transitions with proper cubic-bezier curves  
✅ **Safe Area Support** - Full support for iPhone notch, Dynamic Island, and home indicator  
✅ **Backdrop Blur** - iOS-style frosted glass effects with blur(20px) + saturate(180%)  

### UI Components

#### 📱 Navigation
- **Tab Bar (UITabBar)**: 
  - Bottom navigation with 49px height
  - 26px icons with 2.5px stroke width
  - iOS blue (#007AFF) tint for active state
  - Frosted glass material with backdrop blur
  - Safe area inset support for home indicator
  
- **Navigation Bar**: 
  - Large title style with 34px bold text
  - 0.37px letter spacing for iOS authenticity
  - Proper safe area inset for notch/Dynamic Island
  
- **Sidebar (macOS)**: 
  - 256px width with proper spacing
  - Hover states and active indicators
  - Gradient app icon in header

#### 📋 Lists & Cards
- **Inset Grouped Lists**: 
  - Rounded cards with 20px border radius
  - 0.33px separators (iOS standard)
  - Dark background (#1C1C1E)
  
- **List Items**: 
  - 44px minimum touch target (iOS accessibility)
  - Right-aligned values with iOS blue
  - Proper padding and spacing
  
- **Swipe Actions**: 
  - iOS-style delete buttons
  - Red background (#FF3B30)
  - Smooth swipe animations

#### 📝 Forms
- **Segmented Control**: 
  - iOS-style toggle with 2px padding
  - Smooth sliding animation
  - Active state with shadow
  
- **Text Fields**: 
  - Right-aligned values (iOS convention)
  - Placeholder color: #8E8E93
  - No borders, clean appearance
  
- **Date Picker**: 
  - Native iOS date input styling
  - Right-to-left text direction
  - iOS blue color for selected date

#### 🎭 Modals & Sheets
- **Sheet Presentation**: 
  - Bottom sheet with 28px top border radius
  - Slide-up animation (350ms cubic-bezier)
  - Backdrop blur with 50% black overlay
  - Page scale-back effect (0.95 scale)
  
- **Modal Animations**:
  - Slide up: cubic-bezier(0.32, 0.72, 0, 1)
  - Fade in/out: 300ms ease
  - Scale in/out: 300ms with GPU acceleration

#### 🎴 Cards & Widgets
- **Dashboard Cards**: 
  - 20px border radius
  - Subtle shadows for depth
  - Dark background with proper contrast
  
- **Charts**: 
  - iOS-style tooltips
  - System colors for data visualization
  - Smooth animations on load
  
- **For You Card**: 
  - Apple Music/Fitness-inspired gradient
  - Purple to pink gradient (#2D0F5C to #4A1028)
  - Frosted glass elements

### 🎯 Accessibility

- ✅ **Touch Targets**: Minimum 44x44pt (iOS guidelines)
- ✅ **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- ✅ **Semantic HTML**: Proper ARIA labels and roles
- ✅ **Keyboard Navigation**: Full support with focus indicators
- ✅ **Reduced Motion**: Respects prefers-reduced-motion
- ✅ **Screen Reader**: Descriptive labels for all interactive elements

### ⚡ Performance Optimizations

- 🚀 **GPU Acceleration**: 
  - translate3d(0, 0, 0) for hardware acceleration
  - backface-visibility: hidden to prevent flickering
  - perspective: 1000px for 3D transforms
  
- 🚀 **Will-change**: 
  - Applied only during animations
  - Automatically removed after animation completes
  - Prevents excessive memory usage
  
- 🚀 **Layout Containment**: 
  - contain: layout for stable rendering
  - contain: paint for isolated repaints
  - contain: strict for maximum optimization
  
- 🚀 **Smooth Scrolling**: 
  - -webkit-overflow-scrolling: touch
  - overscroll-behavior: contain
  - iOS-style bounce effect
  
- 🚀 **Optimized Animations**: 
  - Only transform and opacity (GPU-friendly)
  - requestAnimationFrame for timing
  - Debounced scroll handlers

## 🎨 Design Tokens

### Colors
```css
--ios-blue: #007AFF
--ios-green: #34C759
--ios-red: #FF3B30
--ios-orange: #FF9500
--ios-yellow: #FFCC00
--ios-purple: #AF52DE
--ios-pink: #FF2D55
--ios-teal: #5AC8FA
--ios-indigo: #5856D6
--ios-gray: #8E8E93
--ios-background: #F2F2F7
--ios-separator: #3C3C4349
```

### Typography
```css
Large Title: 34px / 700 / 0.37px
Title 1: 28px / 700 / 0.36px
Title 2: 22px / 700 / 0.35px
Title 3: 20px / 600 / 0.38px
Headline: 17px / 600 / -0.41px
Body: 17px / 400 / -0.41px
Callout: 16px / 400 / -0.32px
Subheadline: 15px / 400 / -0.24px
Footnote: 13px / 400 / -0.08px
Caption 1: 12px / 400 / 0px
Caption 2: 11px / 400 / 0.06px
```

### Spacing
```css
Safe Area: env(safe-area-inset-*)
Touch Target: 44px minimum
Card Padding: 16-20px
List Item Height: 44-64px
```

## 📱 iOS-Specific Features

### Safe Area Support
- **env(safe-area-inset-*)** - Dynamic spacing for notch, Dynamic Island, and home indicator
- **Viewport-fit=cover** - Full-screen layout with proper insets
- **Adaptive Padding** - Automatically adjusts for different iPhone models

### Native Feel
- **Tap Highlight Disabled** - -webkit-tap-highlight-color: transparent
- **Font Smoothing** - -webkit-font-smoothing: antialiased for crisp text
- **Overscroll Bounce** - iOS-style rubber band effect
- **Touch Callout Disabled** - Prevents long-press context menu
- **User Select** - Disabled globally, enabled for inputs

### Visual Effects
- **Backdrop Blur** - Frosted glass navigation bars and modals
- **Material Design** - iOS-style translucent backgrounds
- **Vibrancy** - Layered blur effects for depth
- **Shadows** - Subtle elevation matching iOS standards

### Interactions
- **Haptic Feedback Simulation** - Visual scale feedback on button press
- **Active States** - 0.6 opacity on touch (iOS standard)
- **Smooth Transitions** - Native-feeling animations
- **Gesture Support** - Swipe actions, pull-to-refresh ready

### Typography
- **SF Pro Font Stack** - Apple's system font with fallbacks
- **Letter Spacing** - Precise tracking values matching iOS
- **Font Weights** - 400 (Regular), 600 (Semibold), 700 (Bold)
- **Tabular Numbers** - Monospaced digits for amounts

### Dark Mode
- **OLED Optimized** - True black (#000000) background
- **High Contrast** - White text on dark backgrounds
- **Reduced Brightness** - Easy on the eyes in low light
- **System Colors** - iOS dark mode color palette

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3** - Latest stable React with concurrent features
- **TypeScript 5.6** - Full type safety with strict mode
- **Vite 6.2** - Lightning-fast build tool with HMR

### Styling & Design
- **Tailwind CSS 3.4** - Utility-first CSS with custom iOS design tokens
- **Custom CSS** - iOS-specific animations, blur effects, and safe area support
- **Lucide React 0.554** - Beautiful, consistent icon library

### Data Visualization
- **Recharts 3.4** - Responsive charts with iOS-style tooltips and colors

### AI & Machine Learning
- **Google Gemini AI 1.30** - Gemini 2.5 Flash model for:
  - Receipt OCR (Vision API)
  - Financial insights generation
  - Smart category suggestions
  - Natural language processing

### Mobile & Native
- **Capacitor 7.4** - Cross-platform native runtime
  - Android support with automated builds
  - Native camera access for receipt scanning
  - Safe area inset support

### Build & Optimization
- **Vite** - Optimized with:
  - Code splitting (React, Charts, AI, Icons)
  - Tree shaking and minification
  - Terser for production builds
  - CSS code splitting
- **PostCSS 8.5** - CSS processing with Autoprefixer
- **Autoprefixer 10.4** - Automatic vendor prefixes

### CI/CD
- **GitHub Actions** - Automated Android APK builds on every push
- **Android Gradle** - Native Android compilation

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript Compiler** - Type checking and validation

## 📦 Project Structure

```
xpense/
├── src/
│   ├── features/                      # Feature-based architecture
│   │   ├── dashboard/                 # Overview dashboard
│   │   │   ├── components/            # StatCard, ExpenseBreakdown, ActivityChart
│   │   │   ├── hooks/                 # useDashboardData
│   │   │   └── Dashboard.tsx          # Main dashboard view
│   │   ├── transactions/              # Transaction management
│   │   │   ├── components/            # Transaction-specific components
│   │   │   ├── TransactionForm.tsx    # Add/edit transaction with receipt scanning
│   │   │   └── TransactionList.tsx    # Transaction history with swipe actions
│   │   ├── insights/                  # AI-powered insights
│   │   │   └── AiInsights.tsx         # Gemini AI financial analysis
│   │   ├── onboarding/                # First-time user experience
│   │   │   └── Onboarding.tsx         # 4-card carousel with API key setup
│   │   └── settings/                  # App settings
│   │       └── Settings.tsx           # API key management, data clearing
│   ├── lib/                           # Core utilities and services
│   │   ├── services/
│   │   │   └── gemini.ts              # Gemini AI integration (receipt OCR, insights, categorization)
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces (Transaction, Category, etc.)
│   │   ├── constants/
│   │   │   └── index.ts               # App constants and initial data
│   │   ├── hooks/
│   │   │   └── usePerformance.ts      # Performance monitoring hooks
│   │   └── utils/
│   │       ├── currency.ts            # Currency formatting (₹ INR)
│   │       └── performance.ts         # Performance optimization utilities
│   ├── shared/                        # Reusable components
│   │   └── components/
│   │       ├── EmptyState.tsx         # Empty state UI
│   │       ├── Spinner.tsx            # Loading spinner
│   │       └── VirtualList.tsx        # Optimized list rendering
│   ├── App.tsx                        # Main app with iOS tab bar & modal navigation
│   ├── main.tsx                       # React entry point
│   └── index.css                      # iOS design system (animations, utilities, safe areas)
├── android/                           # Capacitor Android platform (auto-generated)
├── assets/                            # App icons and splash screens
│   ├── icon.png                       # App icon
│   ├── adaptive-icon.png              # Android adaptive icon
│   └── splash.png                     # Splash screen
├── .github/workflows/                 # CI/CD automation
│   └── build-apk.yml                  # Automated Android APK builds
├── capacitor.config.ts                # Capacitor native configuration
├── app.json                           # Expo/app metadata
├── vite.config.ts                     # Vite build configuration with optimizations
├── tailwind.config.js                 # Tailwind with iOS color palette
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies and scripts
```

## 🎯 iOS Design Guidelines Followed

- ✅ [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- ✅ [iOS Design Themes](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios)
- ✅ [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- ✅ [Color](https://developer.apple.com/design/human-interface-guidelines/color)
- ✅ [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- ✅ [Navigation](https://developer.apple.com/design/human-interface-guidelines/navigation)
- ✅ [Modality](https://developer.apple.com/design/human-interface-guidelines/modality)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server on http://localhost:3000
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally

# Capacitor (Mobile)
npm run cap:sync     # Build web assets and sync with Capacitor
npm run cap:open     # Open Android Studio for testing
npm run android      # Build + sync + open Android Studio (one command)

# Manual Capacitor Commands
npx cap add android  # Add Android platform (first time only)
npx cap sync         # Sync web assets to native projects
npx cap open android # Open Android Studio
```

## 🏗️ Build Optimizations

The app is heavily optimized for performance:

### Code Splitting
- **React Vendor** - React and React DOM (separate chunk)
- **Charts** - Recharts library (lazy loaded)
- **AI** - Google Gemini SDK (lazy loaded)
- **Icons** - Lucide React icons (optimized)

### Performance Features
- **Lazy Loading** - All feature modules lazy loaded with React.lazy()
- **Memoization** - React.memo() on expensive components
- **Virtual Lists** - Efficient rendering of long transaction lists
- **GPU Acceleration** - Hardware-accelerated animations with translate3d
- **Tree Shaking** - Unused code eliminated in production
- **Minification** - Terser with console.log removal
- **CSS Optimization** - Code splitting and purging unused styles

### Bundle Size
- Chunk size warning limit: 600KB
- Manual chunks for optimal loading
- Source maps disabled in production

## 🎯 App Architecture

### State Management
- **Local State** - React useState for component-level state
- **localStorage** - Persistent storage for transactions and settings
- **No External State Library** - Keeps bundle size small and app fast
- **Prop Drilling** - Simple parent-to-child data flow
- **Callbacks** - Child-to-parent communication

### Data Flow
1. User adds transaction → Saved to localStorage
2. Transaction list updates → Dashboard recalculates stats
3. Charts re-render with new data → Smooth animations
4. All changes persist across sessions

### Component Structure

```
App.tsx (Root)
├── Onboarding (First-time only)
├── Sidebar (Desktop only)
├── Main Content
│   ├── Dashboard
│   │   ├── StatCard (x3)
│   │   ├── ExpenseBreakdown (Pie Chart)
│   │   └── ActivityChart (Bar Chart)
│   ├── TransactionList
│   │   └── VirtualList (Optimized rendering)
│   ├── AiInsights
│   │   └── Markdown Renderer
│   └── Settings
└── Tab Bar (Mobile only)
└── Modal (Transaction Form)
```

### Performance Strategy
- **Lazy Loading** - Features loaded on-demand with React.lazy()
- **Memoization** - Expensive calculations cached with useMemo/useCallback
- **Virtual Lists** - Only visible items rendered (content-visibility: auto)
- **Debouncing** - Scroll and input handlers optimized
- **Code Splitting** - Separate chunks for React, Charts, AI, Icons
- **Tree Shaking** - Unused code eliminated in production
- **Minification** - Terser removes console.logs and debuggers

### AI Integration
The app uses Google's Gemini 2.5 Flash model for three main features:

1. **Receipt Scanning** (`analyzeReceipt`)
   - **Input:** base64 image + MIME type
   - **Model:** gemini-2.5-flash with Vision API + Google Search grounding
   - **Two-Step Process:**
     - **Step 1:** Currency detection with Google Search for exchange rates
     - **Step 2:** Full receipt extraction with structured JSON output
   - **Output:** Structured JSON with schema validation
   - **Schema:** merchant (string), date (user's format), total (number in user's currency), category (enum), items (array)
   - **Currency Detection:** Automatically detects currency on receipt (looks for symbols: $, €, £, ¥, ₹, etc.)
   - **Currency Conversion:** Supports 10 currencies with automatic conversion
   - **Google Search Integration:** Uses `tools: [{ googleSearch: {} }]` to fetch real-time exchange rates
   - **Exchange Rate Query:** Searches "1 [SOURCE] to [TARGET] exchange rate today" for accurate conversion
   - **Date Format:** Returns date in user's preferred format (MM/DD/YYYY, DD/MM/YYYY, etc.)
   - **Real-time Context:** Uses current date for context when year is missing
   - **Error Handling:** Try-catch with graceful fallback if conversion fails

2. **Financial Insights** (`generateInsights`)
   - **Input:** Array of transactions with full context (income, expenses, balance)
   - **Model:** gemini-2.5-flash with text generation
   - **Prompt:** Dynamic prompt with user's currency, date format, and financial summary
   - **Output:** Markdown-formatted text with currency symbols
   - **Tone:** Friendly, encouraging (Apple-style)
   - **Context:** Includes total income, expenses, balance, and transaction count
   - **Currency-Aware:** Uses user's currency symbol throughout the analysis
   - **Date Formatting:** Formats all dates according to user preference
   - **Rendering:** marked library converts Markdown to HTML

3. **Smart Categorization** (`suggestCategory`)
   - **Input:** Transaction description (string)
   - **Model:** gemini-2.5-flash with text generation
   - **Prompt:** Dynamic prompt with category descriptions and regional context
   - **Output:** Category name (plain text)
   - **Context-Aware:** Considers user's currency region for better accuracy
   - **Validation:** Matches against Category enum
   - **Fallback:** "Other" if no match or error

**API Key Management:**
- Stored in localStorage (`xpense-api-key`)
- Fallback to environment variable (`GEMINI_API_KEY`)
- Can be added/updated via UI (Onboarding or Settings)
- Validated on first use (error messages if invalid)

**Error Handling:**
- All AI functions wrapped in try-catch
- User-friendly error messages
- Graceful degradation (app works without AI)
- Loading states with spinners

### localStorage Schema

```typescript
// Transactions
localStorage.setItem('xpense-expenses', JSON.stringify([
  {
    id: 'uuid-v4',
    amount: 100.50,
    description: 'Grocery shopping',
    category: 'Food',
    date: '2025-11-21T10:30:00.000Z',
    isExpense: true
  }
]))

// API Key
localStorage.setItem('xpense-api-key', 'your-gemini-api-key')

// Onboarding Complete
localStorage.setItem('xpense-onboarding-complete', 'true')
```

### Routing Strategy
- **No Router** - Single-page app with tab-based navigation
- **State-based Views** - activeTab state controls which component renders
- **Modal Overlay** - Transaction form as modal, not separate route
- **Benefits:** Faster, simpler, smaller bundle size

## 🔐 Privacy & Security

### Data Storage
- **100% Local** - All transactions stored in browser localStorage
- **No Server** - No backend, no database, no cloud sync
- **No Tracking** - Zero analytics or telemetry
- **API Key Security** - Stored locally, never transmitted except to Gemini API

### What Gets Sent to Gemini AI
Only when you explicitly use AI features:
- **Receipt Scanning** - Image data (base64)
- **Insights** - Transaction summaries (date, description, amount, category)
- **Categorization** - Transaction description only

Your API key is sent with each request but never stored on Google's servers beyond the request lifecycle.

## 🌍 Localization

### Supported Currencies (10)
- 🇺🇸 **USD** - US Dollar ($)
- 🇪🇺 **EUR** - Euro (€)
- 🇬🇧 **GBP** - British Pound (£)
- 🇯🇵 **JPY** - Japanese Yen (¥)
- 🇨🇳 **CNY** - Chinese Yuan (¥)
- 🇮🇳 **INR** - Indian Rupee (₹)
- 🇨🇦 **CAD** - Canadian Dollar ($)
- 🇦🇺 **AUD** - Australian Dollar ($)
- 🇨🇭 **CHF** - Swiss Franc (Fr)
- 🇰🇷 **KRW** - South Korean Won (₩)

### Supported Date Formats (5)
- **MM/DD/YYYY** - US format (11/20/2025)
- **DD/MM/YYYY** - European format (20/11/2025)
- **YYYY-MM-DD** - ISO 8601 (2025-11-20)
- **DD.MM.YYYY** - German format (20.11.2025)
- **MMM DD, YYYY** - Long format (Nov 20, 2025)

### AI Features
- **Receipt Scanning** - Automatically detects and converts foreign currency receipts using real-time exchange rates from Google Search
- **Financial Insights** - Uses your currency symbol and date format throughout
- **Smart Categorization** - Considers regional spending patterns based on your currency
- **Live Exchange Rates** - Google Search grounding ensures accurate, up-to-date currency conversion

### Language
- Currently: English only
- Easy to extend by modifying AI prompts in `src/lib/services/gemini.ts`

## 🐛 Known Issues & Limitations

- **No Cloud Sync** - Data is device-specific (localStorage)
- **No Budgets** - No budget tracking or alerts (planned)
- **No Recurring Transactions** - Manual entry only
- **No Multi-user** - Single-user app (no accounts)
- **Receipt OCR Accuracy** - Depends on image quality and receipt clarity
- **Google Search Dependency** - Currency conversion requires internet connection for real-time rates

## 🗺️ Roadmap

- [ ] Export transactions (CSV, PDF)
- [ ] Budget tracking and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Cloud sync (optional)
- [ ] iOS app (native Swift)
- [ ] Widgets for iOS/Android
- [ ] Apple Watch companion app
- [ ] Siri Shortcuts integration

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please ensure your code:
- Follows the existing code style
- Includes TypeScript types
- Maintains iOS design consistency
- Is well-commented
- Doesn't break existing functionality

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Apple** - For the incredible iOS design system
- **Google** - For the powerful Gemini AI API
- **Vercel** - For the amazing Vite build tool
- **Tailwind Labs** - For Tailwind CSS
- **Lucide** - For beautiful icons

## 📧 Contact

**Bhavesh Patil**
- GitHub: [@iambhvsh](https://github.com/iambhvsh)
- Project: [xpense](https://github.com/iambhvsh/xpense)

---

**Made with ❤️ and attention to detail**

If you find this project useful, please consider giving it a ⭐ on GitHub!
