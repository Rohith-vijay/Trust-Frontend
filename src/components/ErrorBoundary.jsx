import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ErrorBoundary:${this.props.name || "Default"}] Caught exception:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 bg-rose-50/20 border border-rose-100 rounded-3xl text-rose-950 space-y-4 shadow-sm text-center max-w-lg mx-auto my-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl select-none">⚠️</span>
            <h4 className="text-base font-black text-slate-800 tracking-tight mt-2">
              Something went wrong. Please try again.
            </h4>
            <p className="text-xs font-semibold text-slate-500 max-w-sm leading-relaxed">
              An unexpected error occurred in this section of the website. The error has been logged, and you can try to reload or navigate away.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-5 py-2.5 rounded-full transition shadow-sm cursor-pointer"
            >
              Retry
            </button>
            <a 
              href="/"
              className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-full transition shadow-sm decoration-none"
            >
              Home
            </a>
            <a 
              href="/contact"
              className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-full transition shadow-sm decoration-none"
            >
              Contact Us
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
