# 💰 xpense - iOS-Style Expense Tracker

A beautifully designed expense tracking application that **strictly follows Apple's iOS Human Interface Guidelines**, powered by Google's Gemini AI.

![iOS Design](https://img.shields.io/badge/Design-iOS%20HIG-007AFF?style=for-the-badge&logo=apple)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 💸 **Expense Tracking** - Add income and expenses with categories
- 🤖 **AI Insights** - Gemini-powered financial advice
- 📸 **Receipt Scanning** - OCR with Gemini Vision API
- 🏷️ **Auto-categorization** - Smart category suggestions
- 📊 **Beautiful Charts** - Pie and bar charts with iOS styling
- 📱 **Responsive Design** - iPhone, iPad, and Mac optimized
- 🔒 **Privacy First** - All data stored locally on your device

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

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

3. **Set your Gemini API key:**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📱 Building for Android

This project uses **Capacitor** + **EAS Build** for cloud-based Android builds.

### First Time Setup

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

### Build Android APK

**Cloud build (recommended):**
```bash
npm run build:android
```

This will:
- Build your web app with Vite
- Sync with Capacitor
- Build the APK in the cloud
- Provide a download link when complete

**Local development:**
```bash
npm run android
```

Opens Android Studio for local testing.

## 🎨 iOS Design System

This app has been **completely redesigned** to match iOS design standards with pixel-perfect accuracy:

### Design Principles Applied

✅ **SF Pro Font Family** - Apple's system font stack  
✅ **iOS Color Palette** - Exact system colors (Blue #007AFF, Green #34C759, Red #FF3B30)  
✅ **iOS Typography Scale** - Large Title, Title 1-3, Headline, Body, Callout, Subheadline, Footnote, Caption  
✅ **iOS Border Radius** - Small (10px), Medium (12px), Large (14px), XLarge (20px)  
✅ **iOS Shadows** - Subtle elevation system matching iOS depth  
✅ **iOS Animations** - Native-feeling transitions with proper cubic-bezier curves  
✅ **Safe Area Support** - Full support for iPhone notch and home indicator  
✅ **Backdrop Blur** - iOS-style frosted glass effects  

### UI Components

#### 📱 Navigation
- **Tab Bar (UITabBar)**: Bottom navigation with 49px height, 28px icons, iOS blue tint
- **Navigation Bar**: Large title style with 34px bold text
- **Sidebar (macOS)**: Desktop-optimized sidebar with proper spacing

#### 📋 Lists
- **Inset Grouped Lists**: Rounded cards with 0.5px separators
- **List Items**: 44px minimum touch target, proper padding
- **Swipe Actions**: Delete buttons with iOS styling

#### 📝 Forms
- **Segmented Control**: iOS-style toggle with smooth animations
- **Text Fields**: Right-aligned values, iOS placeholder colors
- **Date Picker**: Native iOS date input styling

#### 🎭 Modals
- **Sheet Presentation**: Bottom sheet with grabber handle
- **Backdrop**: 40% black overlay with blur
- **Slide Animation**: 350ms cubic-bezier(0.32, 0.72, 0, 1)

#### 🎴 Cards
- **Dashboard Cards**: Rounded corners, subtle shadows
- **Charts**: iOS-style tooltips and colors
- **For You Card**: Apple Music/Fitness-inspired gradient

### 🎯 Accessibility
- ✅ **Touch Targets**: Minimum 44x44pt (iOS guidelines)
- ✅ **Color Contrast**: WCAG AA compliant
- ✅ **Semantic HTML**: Proper ARIA labels
- ✅ **Keyboard Navigation**: Full support

### ⚡ Performance
- 🚀 **GPU Acceleration**: transform: translateZ(0)
- 🚀 **Will-change**: Optimized animations
- 🚀 **Overscroll Behavior**: iOS-style bounce
- 🚀 **Hardware Acceleration**: Composite layers

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

- **Safe Area Insets**: Proper spacing for notch and home indicator
- **Tap Highlight**: Disabled for native feel
- **Font Smoothing**: -webkit-font-smoothing: antialiased
- **Overscroll**: Bounce effect on iOS
- **Backdrop Blur**: Frosted glass navigation bars
- **Haptic Feedback**: Visual scale feedback on buttons

## 🛠️ Tech Stack

- **React 18.3** - Latest stable React
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS with custom iOS tokens
- **Vite 6.2** - Lightning-fast build tool
- **Capacitor 7.4** - Native mobile wrapper
- **Recharts 3.4** - Beautiful charts
- **Lucide React** - iOS-style icons
- **Google Gemini AI** - AI-powered insights and OCR
- **EAS Build** - Cloud-based Android builds

## 📦 Project Structure

```
xpense/
├── src/
│   ├── features/              # Feature modules
│   │   ├── dashboard/         # Overview with charts
│   │   ├── transactions/      # Transaction list & form
│   │   ├── insights/          # AI-powered insights
│   │   └── settings/          # App settings
│   ├── lib/
│   │   ├── services/          # External services (Gemini AI)
│   │   ├── types/             # TypeScript definitions
│   │   ├── constants/         # App constants
│   │   └── utils/             # Utility functions
│   ├── shared/
│   │   └── components/        # Reusable UI components
│   ├── App.tsx                # Main app with iOS navigation
│   ├── main.tsx               # Application entry point
│   └── index.css              # iOS design system
├── android/                   # Capacitor Android (generated)
├── assets/                    # App icons and splash screens
├── capacitor.config.ts        # Capacitor configuration
├── app.json                   # EAS Build configuration
├── eas.json                   # EAS Build profiles
└── package.json               # Dependencies
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
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run cap:sync     # Sync web build with Capacitor
npm run cap:open     # Open Android Studio
npm run android      # Build and open in Android Studio
npm run build:android # Build APK in the cloud with EAS
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

---

**Made with ❤️ following Apple's iOS Human Interface Guidelines**
