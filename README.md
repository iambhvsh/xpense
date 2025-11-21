# Xpense

A modern, AI-powered expense tracking mobile app built with React, TypeScript, and Capacitor. Track your spending, manage budgets, and get personalized financial insights powered by Google's Gemini AI.

## Features

### Core Functionality
- **Transaction Management** - Add, view, and delete income/expense transactions with detailed categorization
- **Smart Categorization** - 8 predefined categories (Food, Transport, Shopping, Utilities, Entertainment, Health, Income, Other)
- **Budget Tracking** - Set monthly budgets per category and monitor spending
- **Recurring Expenses** - Automate regular payments with daily, weekly, monthly, or yearly frequencies
- **Data Visualization** - Interactive charts showing spending patterns and category breakdowns

### AI-Powered Features (Gemini 2.5 Flash)
- **Receipt Scanning** - OCR with automatic currency detection and conversion across 10 major currencies
- **Financial Insights** - Personalized spending analysis and actionable savings tips
- **Smart Suggestions** - AI-powered category recommendations based on transaction descriptions
- **Real-time Exchange Rates** - Google Search integration for accurate currency conversion

### Multi-Currency Support
Supports 10 major currencies with automatic conversion:
- USD (US Dollar), EUR (Euro), GBP (British Pound)
- JPY (Japanese Yen), CNY (Chinese Yuan), INR (Indian Rupee)
- CAD (Canadian Dollar), AUD (Australian Dollar)
- CHF (Swiss Franc), KRW (South Korean Won)

### Data Management
- **Local Storage** - IndexedDB (Dexie) for offline-first data persistence
- **CSV Import/Export** - Backup and restore your transaction data
- **Category Management** - Create custom categories beyond defaults
- **Settings Persistence** - API keys, currency, date format preferences

## Tech Stack

### Frontend
- **React 18** - UI framework with hooks and lazy loading
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with iOS-inspired design system
- **Lucide React** - Modern icon library
- **Recharts** - Data visualization

### Mobile
- **Capacitor 7** - Native Android app wrapper
- **Vite** - Fast build tool and dev server

### Database
- **Dexie** - IndexedDB wrapper with React hooks
- **Schema**: Transactions, Categories, Recurring Expenses, Settings

### AI Integration
- **Google Gemini 2.5 Flash** - AI model for insights and OCR
- **Google Search Grounding** - Real-time exchange rate fetching

## Project Structure

```
xpense/
├── src/
│   ├── app/
│   │   └── constants/          # Navigation and app-level constants
│   ├── components/
│   │   ├── budget/             # Budget management components
│   │   ├── context/            # React context providers
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── layout/             # App layout (sidebar, tabs, modals)
│   │   ├── settings/           # Settings UI
│   │   ├── transactions/       # Transaction list items
│   │   └── ui/                 # Reusable UI components
│   ├── features/
│   │   ├── budget/             # Budget feature page
│   │   ├── dashboard/          # Overview dashboard
│   │   ├── insights/           # AI insights feature
│   │   ├── onboarding/         # First-time user flow
│   │   ├── settings/           # Settings page
│   │   └── transactions/       # Transaction form and list
│   ├── lib/
│   │   ├── constants/          # Category metadata and defaults
│   │   ├── db/                 # Dexie database schema and helpers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Gemini AI service
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Utility functions (CSV, currency, budget)
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── android/                    # Capacitor Android project
├── assets/                     # App icons and splash screens
├── .github/workflows/          # CI/CD for APK builds
├── capacitor.config.ts         # Capacitor configuration
├── vite.config.ts              # Vite build configuration
└── tailwind.config.js          # Tailwind theme (iOS colors)
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Android Studio (for Android development)
- Java JDK 21 (for Android builds)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd xpense
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (optional)
Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Note: You can also add the API key later through the app's Settings page.

### Development

#### Web Development
```bash
npm run dev
```
Opens at `http://localhost:3000`

#### Android Development
```bash
# Build web assets and sync to Android
npm run cap:sync

# Open Android Studio
npm run cap:open

# Or run both commands
npm run android
```

### Building

#### Web Build
```bash
npm run build
```

#### Android APK
```bash
# Sync Capacitor
npm run cap:sync

# Build in Android Studio or via Gradle
cd android
./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/`

## Configuration

### Capacitor Config
- **App ID**: `com.xpense.app`
- **App Name**: xpense
- **Web Dir**: `dist`
- **Android Scheme**: HTTPS

### Vite Build Optimization
- Code splitting for React, Charts, AI, and Icons
- Terser minification with console removal
- Target: ES2015
- Chunk size limit: 600KB

### Tailwind Theme
Custom iOS-inspired color palette:
- `ios-blue`, `ios-green`, `ios-red`, `ios-orange`
- `ios-yellow`, `ios-purple`, `ios-pink`, `ios-teal`
- `ios-indigo`, `ios-gray`

## CI/CD

GitHub Actions workflow (`.github/workflows/build-apk.yml`) automatically:
1. Builds web assets
2. Syncs Capacitor
3. Generates app icons
4. Builds release APK
5. Uploads artifact

Triggers on push to `main` branch and pull requests.

## Database Schema

### Transactions
- `id` (auto-increment)
- `amount`, `category`, `description`, `note`
- `date`, `createdAt`, `updatedAt`

### Categories
- `id` (auto-increment)
- `name`, `monthlyBudget` (optional)

### Recurring Expenses
- `id` (auto-increment)
- `amount`, `category`, `description`, `note`
- `frequency` (daily/weekly/monthly/yearly)
- `nextRun`, `isActive`
- `createdAt`, `updatedAt`

### Settings
- `key` (primary key)
- `value` (any)

## API Integration

### Gemini AI Service
Located in `src/lib/services/gemini.ts`

**Functions:**
- `analyzeReceipt(base64Image, mimeType)` - OCR with currency conversion
- `generateInsights(transactions)` - Financial advice generation
- `suggestCategory(description)` - Smart categorization

**Configuration:**
- Model: `gemini-2.5-flash`
- Tools: Google Search (for exchange rates)
- Output: JSON schema for structured data

## Performance Optimizations

- Lazy loading for feature pages
- Virtual scrolling for transaction lists
- React.memo for expensive components
- Debounced search and filters
- IndexedDB for instant offline access
- Code splitting and tree shaking
- CSS code splitting

## User Experience

- iOS-inspired design language
- Smooth animations and transitions
- Bottom tab navigation (mobile)
- Sidebar navigation (desktop)
- Modal-based transaction entry
- Onboarding flow for first-time users
- Empty states with helpful guidance
- Loading spinners and skeletons

## Privacy & Security

- All data stored locally in IndexedDB
- No server-side storage
- API keys stored in local settings
- Transaction data only shared with Gemini AI when using AI features
- No analytics or tracking

## Production Release

### Building for Production

1. **Setup Keystore** (First time only)
   - Follow instructions in `KEYSTORE_SETUP.md`
   - Add secrets to GitHub: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_PASSWORD`

2. **Automated Build via GitHub Actions**
   ```bash
   git push origin main
   ```
   - APK will be built automatically
   - Download from Actions artifacts

3. **Manual Build**
   ```bash
   npm run build
   npm run cap:sync
   cd android
   ./gradlew assembleRelease
   ```

### Pre-Release Checklist
See `PRODUCTION_CHECKLIST.md` for complete checklist including:
- Keystore setup
- Testing requirements
- Google Play Console setup
- Store listing content
- Release strategy

### Privacy Policy
See `PRIVACY_POLICY.md` for the complete privacy policy to use in Google Play Store.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, TypeScript, and Capacitor
