import { FiSun, FiMoon, FiGithub } from 'react-icons/fi';
import RateLimitBadge from './RateLimitBadge';

function Navbar({ activeTab, onTabChange, theme, onThemeToggle, rateLimit }) {
  return (
    <nav className="navbar">
      <div className="navbar__row-1">
        <div className="navbar__brand">
          <FiGithub className="navbar__logo-icon" />
          <span className="navbar__title">GitHub Analyzer</span>
        </div>
        <div className="navbar__right-mobile">
          <RateLimitBadge
            remaining={rateLimit?.remaining}
            limit={rateLimit?.limit}
            resetTime={rateLimit?.resetTime}
          />
          <button
            className="navbar__theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
      <div className="navbar__row-2">
        <div className="navbar__tabs">
          <button
            className={`navbar__tab ${activeTab === 'search' ? 'navbar__tab--active' : ''}`}
            onClick={() => onTabChange('search')}
          >
            Search
          </button>
          <button
            className={`navbar__tab ${activeTab === 'compare' ? 'navbar__tab--active' : ''}`}
            onClick={() => onTabChange('compare')}
          >
            Compare
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
