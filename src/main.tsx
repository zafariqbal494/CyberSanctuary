import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initFontLoading } from './utils/fontLoader';

// Initialize font loading optimization
initFontLoading();

createRoot(document.getElementById("root")!).render(<App />);
