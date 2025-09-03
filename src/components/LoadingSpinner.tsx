import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading your music...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner-wrapper">
        <div className="music-loading-animation">
          <div className="vinyl-record">
            <div className="vinyl-center"></div>
            <div className="vinyl-grooves"></div>
          </div>
          <div className="sound-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
            <div className="wave wave-4"></div>
          </div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
