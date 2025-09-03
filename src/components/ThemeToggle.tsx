import React from 'react';
import type { Theme } from '../hooks/useTheme';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button 
      className={`theme-toggle ${theme}`} 
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <div className="theme-icon">
            {theme === 'light' ? '🌙' : '☀️'}
          </div>
        </div>
        <div className="theme-toggle-background">
          <div className="stars">
            <span className="star star-1">⭐</span>
            <span className="star star-2">✨</span>
            <span className="star star-3">💫</span>
          </div>
          <div className="clouds">
            <span className="cloud cloud-1">☁️</span>
            <span className="cloud cloud-2">⛅</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
