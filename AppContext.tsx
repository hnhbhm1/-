
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Currency, Category, Product, PaymentMethod } from './types';
import { INITIAL_STATE } from './constants';

interface AppContextType {
  state: AppState;
  activeCurrency: Currency;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setActiveCurrency: (c: Currency) => void;
  updateState: (newState: Partial<AppState>) => void;
  formatPrice: (priceUSD: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('trend_card_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('trend_card_theme') === 'dark';
  });

  // Default to YER as requested
  const [activeCurrency, setActiveCurrency] = useState<Currency>(() => {
    const yer = state.currencies.find(c => c.code === 'YER');
    return yer || state.currencies[0];
  });

  // Auto-detect currency based on timezone/locale
  useEffect(() => {
    const detectCurrency = () => {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;
        
        let detectedCode = 'YER'; // Default
        
        if (timeZone.includes('Riyadh') || locale.includes('sa')) {
          detectedCode = 'SAR';
        } else if (locale.includes('US') || !locale.includes('ar')) {
          // If purely international/US, maybe keep USD, but default for this app is YER
          // Only switch if strongly confident.
        }

        const detected = state.currencies.find(c => c.code === detectedCode && c.isActive);
        if (detected) {
          setActiveCurrency(detected);
        }
      } catch (e) {
        console.error("Currency detection failed", e);
      }
    };

    // Only auto-detect if user hasn't manually set one in this session
    if (!sessionStorage.getItem('currency_manually_set')) {
      detectCurrency();
    }
  }, [state.currencies]);

  useEffect(() => {
    localStorage.setItem('trend_card_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trend_card_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trend_card_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleCurrencyChange = (c: Currency) => {
    setActiveCurrency(c);
    sessionStorage.setItem('currency_manually_set', 'true');
  };

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * activeCurrency.rate;
    return `${converted.toLocaleString('ar-YE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${activeCurrency.symbol}`;
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      activeCurrency, 
      isDarkMode, 
      toggleDarkMode, 
      setActiveCurrency: handleCurrencyChange, 
      updateState, 
      formatPrice 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
