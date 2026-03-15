import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TelegramContext = createContext(null);

/**
 * Telegram WebApp integration hook
 */
export function TelegramProvider({ children }) {
  const [webApp, setWebApp] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [startParam, setStartParam] = useState(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Ready the WebApp
      tg.ready();
      tg.expand();
      
      // Set theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0a0a0f');
      
      setWebApp(tg);
      setIsReady(true);
      
      // Get start parameter (for deep links)
      if (tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
        setStartParam(tg.initDataUnsafe.start_param);
      }
      
      // Set up back button
      tg.BackButton.onClick(() => {
        window.history.back();
      });
    } else {
      // Development mode without Telegram
      console.log('Running outside Telegram - using development mode');
      setIsReady(true);
      
      // Mock user for development
      if (process.env.NODE_ENV === 'development') {
        setUser({
          id: 123456789,
          first_name: 'Dev',
          last_name: 'User',
          username: 'devuser',
        });
      }
    }
  }, []);

  // Get init data for API calls
  const getInitData = useCallback(() => {
    if (webApp && webApp.initData) {
      return webApp.initData;
    }
    return '';
  }, [webApp]);

  // Show main button
  const showMainButton = useCallback((text, onClick) => {
    if (webApp) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  }, [webApp]);

  // Hide main button
  const hideMainButton = useCallback(() => {
    if (webApp) {
      webApp.MainButton.hide();
    }
  }, [webApp]);

  // Show back button
  const showBackButton = useCallback(() => {
    if (webApp) {
      webApp.BackButton.show();
    }
  }, [webApp]);

  // Hide back button
  const hideBackButton = useCallback(() => {
    if (webApp) {
      webApp.BackButton.hide();
    }
  }, [webApp]);

  // Show popup alert
  const showPopup = useCallback((message) => {
    if (webApp) {
      webApp.showPopup({
        message,
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert(message);
    }
  }, [webApp]);

  // Show confirm dialog
  const showConfirm = useCallback((message, onConfirm) => {
    if (webApp) {
      webApp.showPopup({
        message,
        buttons: [
          { type: 'cancel' },
          { type: 'ok', text: 'Confirm' }
        ]
      }, (buttonId) => {
        if (buttonId === 1) {
          onConfirm();
        }
      });
    } else {
      if (window.confirm(message)) {
        onConfirm();
      }
    }
  }, [webApp]);

  // Haptic feedback
  const haptic = useCallback((type = 'light') => {
    if (webApp && webApp.HapticFeedback) {
      switch (type) {
        case 'light':
          webApp.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          webApp.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          webApp.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          webApp.HapticFeedback.notificationOccurred('success');
          break;
        case 'error':
          webApp.HapticFeedback.notificationOccurred('error');
          break;
        case 'warning':
          webApp.HapticFeedback.notificationOccurred('warning');
          break;
      }
    }
  }, [webApp]);

  // Close the mini app
  const close = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  const value = {
    webApp,
    isReady,
    user,
    setUser,
    startParam,
    getInitData,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showPopup,
    showConfirm,
    haptic,
    close,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
}

export default TelegramContext;