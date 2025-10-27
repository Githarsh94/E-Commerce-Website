import React from 'react';
import "./ErrorBoundaries.css";

interface ErrorBoundariesProps {
  children?: React.ReactNode;
}

interface ErrorBoundariesState {
  hasError: boolean;
}

class ErrorBoundaries extends React.Component<ErrorBoundariesProps, ErrorBoundariesState> {
  constructor(props: ErrorBoundariesProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="error-boundary-message">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundaries;
