import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import { PostHogProvider } from './app/providers/PostHogProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider>
      <App />
    </PostHogProvider>
  </StrictMode>
);