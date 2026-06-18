import { useState } from 'react';
import { FiSearch, FiGithub, FiTrendingUp, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { fetchUser, fetchRepos } from '../api/github';
import ProfileCard from './ProfileCard';
import StatsGrid from './StatsGrid';
import ScoreCard from './ScoreCard';
import TopRepos from './TopRepos';
import LanguageChart from './LanguageChart';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function SearchView({ onRateLimitUpdate }) {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setUser(null);
    setRepos(null);

    try {
      const userResult = await fetchUser(trimmed);
      onRateLimitUpdate(userResult.rateLimit);

      const reposResult = await fetchRepos(trimmed);
      onRateLimitUpdate(reposResult.rateLimit);

      setUser(userResult.data);
      setRepos(reposResult.data);
    } catch (err) {
      setError(err.message);
      if (err.rateLimit) onRateLimitUpdate(err.rateLimit);
    } finally {
      setLoading(false);
    }
  };

  const showHero = !user && !repos && !loading && !error;

  return (
    <div className="search-view">
      {showHero && (
        <div className="search-view__hero fade-in">
          <div className="search-view__hero-icon-wrap">
            <FiGithub className="search-view__hero-icon" />
          </div>
          <h1 className="search-view__hero-title">GitHub Profile Analyzer</h1>
          <p className="search-view__hero-subtitle">
            Search any GitHub username to view their developer score, stats, top repos, and language breakdown.
          </p>
        </div>
      )}

      <form className="search-view__form" onSubmit={handleSearch}>
        <div className="search-view__input-wrapper">
          <FiSearch className="search-view__input-icon" />
          <input
            type="text"
            className="search-view__input"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="GitHub username"
          />
        </div>
        <button
          type="submit"
          className="search-view__btn"
          disabled={loading || !username.trim()}
        >
          {loading ? 'Searching...' : 'Analyze'}
        </button>
      </form>

      {showHero && (
        <div className="search-view__features fade-in">
          <div className="search-view__feature">
            <FiTrendingUp className="search-view__feature-icon" />
            <h3>Developer Score</h3>
            <p>Weighted 0-100 score based on stars, followers, repos, activity & more</p>
          </div>
          <div className="search-view__feature">
            <FiUsers className="search-view__feature-icon" />
            <h3>Compare Mode</h3>
            <p>Compare two developers side by side across every category</p>
          </div>
          <div className="search-view__feature">
            <FiBarChart2 className="search-view__feature-icon" />
            <h3>Language Breakdown</h3>
            <p>Visual chart showing which languages dominate the profile</p>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {user && repos && (
        <div className="search-view__results fade-in">
          <ProfileCard user={user} repos={repos} />
          <StatsGrid user={user} repos={repos} />
          <div className="search-view__two-col">
            <ScoreCard user={user} repos={repos} />
            <LanguageChart repos={repos} />
          </div>
          <TopRepos repos={repos} />
        </div>
      )}
    </div>
  );
}

export default SearchView;
