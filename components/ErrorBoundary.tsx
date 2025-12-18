
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { trackError } from '../lib/monitoring';

// Fixed: Define props with optional children to satisfy usage in index.tsx where TypeScript might not infer JSX children correctly
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

// ErrorBoundary implements React Error Boundary pattern for production resilience
// Fixed: Explicitly extending React.Component with typed Props and State to resolve inheritance errors
export class ErrorBoundary extends React.Component<Props, State> {
  // Fixed: Initializing state as a class property for better TypeScript support in Error Boundaries
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
  }

  // Mandatory static method for error boundaries to update state based on errors
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Catch side effects of errors for logging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackError(error, `React ErrorBoundary: ${errorInfo.componentStack}`);
  }

  public render() {
    // Fixed: Accessed state which is now properly inherited from React.Component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We've encountered an unexpected error. Our engineers have been notified and are looking into it.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fixed: Accessed props which are now properly inherited from React.Component
    return this.props.children;
  }
}
