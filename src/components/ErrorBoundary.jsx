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
        <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-2xl text-rose-950 space-y-3 shadow-sm select-text text-left">
          <div className="flex items-center gap-3 text-rose-700 font-extrabold">
            <span className="text-2xl select-none">⚠️</span>
            <div>
              <h4 className="text-sm font-black leading-tight">{this.props.title || "Widget Crash Prevented"}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Isolated Runtime Boundary Shield</p>
            </div>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-gray-600">
            A fatal exception occurred inside this section's React tree. The dashboard shell was shielded from crashing and remains fully responsive.
          </p>
          <div className="bg-white/80 border border-rose-100/60 rounded-xl p-3 font-mono text-[9px] text-rose-800 max-h-32 overflow-auto whitespace-pre-wrap shadow-inner select-text">
            {this.state.error?.stack || this.state.error?.toString()}
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-[10px] font-black text-white bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/20 px-4 py-2 rounded-lg transition duration-200"
          >
            Re-render Component
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
