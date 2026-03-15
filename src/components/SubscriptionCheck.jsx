import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import './SubscriptionCheck.css';

/**
 * Component to verify user has subscribed to the required channel
 */
function SubscriptionCheck({ children }) {
  const { user, showPopup } = useTelegram();
  const { subscription } = useApi();
  const [isChecking, setIsChecking] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channelUsername, setChannelUsername] = useState('');

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const result = await subscription.check(user.id);
      setChannelUsername(result.channelUsername || '');
      setIsSubscribed(result.subscribed);
    } catch (error) {
      console.error('Subscription check error:', error);
      // On error, allow access
      setIsSubscribed(true);
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading state
  if (isChecking) {
    return (
      <div className="subscription-check">
        <div className="subscription-loading">
          <div className="loading-spinner"></div>
          <p>Verifying subscription...</p>
        </div>
      </div>
    );
  }

  // If subscribed or check not configured, show children
  if (isSubscribed) {
    return children;
  }

  // Show subscription prompt
  const handleSubscribe = () => {
    // Open channel in Telegram
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${channelUsername}`);
    } else {
      window.open(`https://t.me/${channelUsername}`, '_blank');
    }
  };

  const handleCheckAgain = () => {
    setIsChecking(true);
    checkSubscription();
  };

  return (
    <div className="subscription-check">
      <div className="subscription-card">
        <div className="subscription-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z" fill="currentColor"/>
          </svg>
        </div>
        <h2 className="subscription-title">Subscription Required</h2>
        <p className="subscription-text">
          Please subscribe to our channel to access the game
        </p>
        <p className="subscription-channel">@{channelUsername}</p>
        <div className="subscription-buttons">
          <button className="btn btn-primary" onClick={handleSubscribe}>
            Subscribe
          </button>
          <button className="btn btn-secondary" onClick={handleCheckAgain}>
            I've Subscribed
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionCheck;