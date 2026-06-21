import { Component } from 'react';

// Catalog previews mount real components with no curated props, so a render
// throw is expected for some. This boundary swaps in a clean typographic
// fallback instead of taking down the whole catalog grid.
class PreviewErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default PreviewErrorBoundary;
