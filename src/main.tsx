import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No StrictMode: it double-invokes effects in dev, and drei's
// ScrollControls does imperative DOM setup (creating the scroll-capture
// div, then async-connecting R3F's event system to it via
// requestAnimationFrame) that isn't safe under that double-invocation —
// it can leave the scroll listener disconnected, silently freezing the
// entire scroll-driven camera/animation with no error.
createRoot(document.getElementById('root')!).render(<App />)
