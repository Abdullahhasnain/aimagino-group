import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * A crash inside <Canvas> (bad WebGL context, a failed shader/texture load,
 * a throw in any Three.js component) is caught by react-three-fiber's own
 * internal boundary and re-thrown outward. Without a boundary here, that
 * unmounts the entire app, leaving a blank page. This keeps the HUD/brand
 * alive and shows a real message instead of nothing.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AImagino experience crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <div className="crash-screen__mark">◆</div>
          <h1>The 3D experience couldn't start</h1>
          <p>
            Your browser or device may not support WebGL2, or a component
            failed to load. Try updating your browser or enabling hardware
            acceleration.
          </p>
          <code>{this.state.error.message}</code>
        </div>
      );
    }
    return this.props.children;
  }
}
