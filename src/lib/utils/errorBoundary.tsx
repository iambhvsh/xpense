import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
          <div className="bg-[#1C1C1E] rounded-[28px] p-8 max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF3B30]/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-[#FF3B30] text-[40px]">⚠️</span>
            </div>
            <h2 className="text-[24px] font-bold text-white mb-3">Something Went Wrong</h2>
            <p className="text-[15px] text-[#8E8E93] mb-6 leading-relaxed">
              The app encountered an unexpected error. Please restart the app.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-ios-blue text-white font-semibold text-[17px] rounded-[16px] active:opacity-80 transition-opacity"
            >
              Restart App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
