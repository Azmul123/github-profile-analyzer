import { useState, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';
import Navbar from './components/Navbar';
import SearchView from './components/SearchView';
import CompareView from './components/CompareView';

function App() {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('search');
  const [rateLimit, setRateLimit] = useState({ remaining: null, limit: null, resetTime: null });

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const handleRateLimitUpdate = useCallback((rl) => {
    if (rl && rl.remaining !== null) {
      setRateLimit(rl);
    }
  }, []);

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        rateLimit={rateLimit}
      />
      <main className="app__main">
        {activeTab === 'search' ? (
          <SearchView onRateLimitUpdate={handleRateLimitUpdate} />
        ) : (
          <CompareView onRateLimitUpdate={handleRateLimitUpdate} />
        )}
      </main>
      <footer className="app__footer">
        <a
          href="https://github.com/Azmul123"
          target="_blank"
          rel="noopener noreferrer"
          className="app__footer-link"
        >
          <FaGithub className="app__footer-icon" />
          <span>Developed by Syed Azmul Haque</span>
        </a>
      </footer>
    </div>
  );
}

export default App;
