import React from 'react';
import './Header.css';

interface HeaderProps {
  user: { display_name: string } | null;
  onLogout: () => void;
  themeToggle: React.ReactNode;
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, themeToggle, isLoggedIn }) => {
  return (
    <header className="app-header">
      <div className="header-left">
  <h1 className="app-title">Rotify</h1>
      </div>
      <div className="header-right">
        {user && (
          <div className="user-info">
            <span className="welcome-text">Welcome, {user.display_name}!</span>
          </div>
        )}
        <div className="header-controls">
          {themeToggle}
          {isLoggedIn && (
            <button onClick={onLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
