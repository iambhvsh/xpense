# Components Directory

This directory contains all reusable components organized by feature and purpose.

## Structure

```
components/
├── layout/          # App-level layout components (Sidebar, TabBar, Header, Modals)
├── transactions/    # Transaction-related components (TransactionItem)
├── dashboard/       # Dashboard-related components (Charts, Stats)
├── budget/          # Budget-related components (Budget Manager, Overview)
├── settings/        # Settings-related components (Category Manager)
├── ui/              # Shared UI components (Spinner, EmptyState, AlertModal)
└── context/         # React Context providers (AlertProvider)
```

## Import Guidelines

All components should be imported using the `@/components` alias:

```tsx
// Layout components
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

// UI components
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

// Feature components
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { StatCard } from '@/components/dashboard/StatCard';

// Context
import { useAlert } from '@/components/context/AlertProvider';
```

## Component Categories

### Layout Components
- **Sidebar**: Desktop navigation sidebar
- **BottomTabBar**: Mobile bottom navigation
- **PageHeader**: Page title and navigation header
- **AddTransactionModal**: Modal for adding transactions

### Transaction Components
- **TransactionItem**: Individual transaction list item with expandable details

### Dashboard Components
- **StatCard**: Summary statistics card (Balance, Income, Spending)
- **ExpenseBreakdown**: Pie chart for category breakdown
- **ActivityChart**: Bar chart for transaction activity

### Budget Components
- **BudgetManager**: Budget creation and management
- **BudgetOverview**: Monthly budget summary
- **CategoryBudgetList**: Budget breakdown by category
- **MonthComparison**: Month-over-month comparison
- **RecurringExpenses**: Recurring expense management

### Settings Components
- **CategoryManager**: Category creation and management

### UI Components
- **Spinner**: Loading spinner
- **EmptyState**: Empty state placeholder
- **AlertModal**: iOS-style alert dialog
- **VirtualList**: Optimized list rendering

### Context Providers
- **AlertProvider**: Global alert/notification system
