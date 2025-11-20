# Source Code Structure

This directory contains all the source code for the Wallet expense tracker application, organized in a modular and maintainable structure.

## Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   └── Spinner.tsx # Loading spinner component
│   ├── AiInsights.tsx  # AI-powered financial insights
│   ├── Dashboard.tsx   # Overview dashboard with charts
│   ├── ExpenseForm.tsx # Transaction input form
│   ├── ExpenseList.tsx # Transaction history list
│   └── Settings.tsx    # App settings and preferences
├── constants/          # Application constants
│   └── index.ts        # Category colors, initial data
├── services/           # External service integrations
│   └── geminiService.ts # Google Gemini AI API integration
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and enums
├── utils/              # Utility functions
│   └── currency.ts     # Currency formatting utilities
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and iOS design system
```

## Module Organization

### Components (`/components`)
All React components are organized by feature:
- **Dashboard**: Overview with statistics and charts
- **ExpenseForm**: Add/edit transactions with AI receipt scanning
- **ExpenseList**: Display transaction history
- **AiInsights**: AI-powered financial advice
- **Settings**: App configuration and data management
- **ui/**: Reusable UI components (Spinner, etc.)

### Services (`/services`)
External API integrations and business logic:
- **geminiService**: Google Gemini AI for receipt OCR and insights

### Types (`/types`)
Centralized TypeScript type definitions:
- Transaction, Category, ReceiptData interfaces
- Shared enums and types

### Utils (`/utils`)
Reusable utility functions:
- **currency**: Currency formatting and date formatting

### Constants (`/constants`)
Application-wide constants:
- Category colors (iOS system colors)
- Initial data

## Import Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of: import { Transaction } from '../../types'
import { Transaction } from '@/types';

// Instead of: import { formatCurrency } from '../../utils/currency'
import { formatCurrency } from '@/utils/currency';
```

Configured in `tsconfig.json` and `vite.config.ts`:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## Code Splitting

The application uses React lazy loading for optimal performance:
- Each major component is loaded on-demand
- Reduces initial bundle size
- Improves page load time

## Design System

All styles follow Apple's iOS Human Interface Guidelines:
- iOS color palette
- SF Pro font family
- iOS typography scale
- Native-feeling animations
- Safe area support

See `index.css` for the complete design system implementation.
