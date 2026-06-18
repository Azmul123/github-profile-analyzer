import { useState } from 'react';
import { FiSearch, FiUser, FiAward, FiTrendingUp } from 'react-icons/fi';
import { fetchUser, fetchRepos } from '../api/github';
import { calculateScore, getScoreLabel, getScoreColor } from '../utils/scoring';
import ProfileCard from './ProfileCard';
import StatsGrid from './StatsGrid';
import ScoreCard from './ScoreCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function CompareColumn({ index, state, onSearch, onUsernameChange }) {
  const { username, user, repos, loading, error } = state;

  return (
    <div className="compare-view__column">
      <form
        className="compare-view__form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(index);
        }}
      >
        <div className="search-view__input-wrapper">
          <FiSearch className="search-view__input-icon" />
          <input
            type="text"
            className="search-view__input"
            placeholder={`User ${index + 1} username...`}
            value={username}
            onChange={(e) => onUsernameChange(index, e.target.value)}
            aria-label={`GitHub username ${index + 1}`}
          />
        </div>
        <button
          type="submit"
          className="search-view__btn"
          disabled={loading || !username.trim()}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!user && !loading && !error && (
        <div className="compare-view__placeholder">
          <FiUser className="compare-view__placeholder-icon" />
          <p>Search a GitHub user</p>
        </div>
      )}

      {user && repos && (
        <div className="fade-in">
          <ProfileCard user={user} repos={repos} />
          <StatsGrid user={user} repos={repos} />
          <ScoreCard user={user} repos={repos} />
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, val1, val2 }) {
  let class1 = 'compare-view__compare-val';
  let class2 = 'compare-view__compare-val';

  if (val1 > val2) {
    class1 += ' compare-view__compare-val--winner';
  } else if (val2 > val1) {
    class2 += ' compare-view__compare-val--winner';
  } else {
    // Tie
    class1 += ' compare-view__compare-val--tie';
    class2 += ' compare-view__compare-val--tie';
  }

  return (
    <div className="compare-view__compare-row">
      <span className={class1}>{typeof val1 === 'number' ? val1.toLocaleString() : val1}</span>
      <span className="compare-view__compare-label">{label}</span>
      <span className={class2}>{typeof val2 === 'number' ? val2.toLocaleString() : val2}</span>
    </div>
  );
}

function CompareView({ onRateLimitUpdate }) {
  const [columns, setColumns] = useState([
    { username: '', user: null, repos: null, loading: false, error: '' },
    { username: '', user: null, repos: null, loading: false, error: '' },
  ]);

  const handleUsernameChange = (index, value) => {
    setColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], username: value };
      return next;
    });
  };

  const handleSearch = async (index) => {
    const trimmed = columns[index].username.trim();
    if (!trimmed) return;

    setColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], loading: true, error: '', user: null, repos: null };
      return next;
    });

    try {
      const userResult = await fetchUser(trimmed);
      onRateLimitUpdate(userResult.rateLimit);

      const reposResult = await fetchRepos(trimmed);
      onRateLimitUpdate(reposResult.rateLimit);

      setColumns((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          user: userResult.data,
          repos: reposResult.data,
          loading: false,
        };
        return next;
      });
    } catch (err) {
      if (err.rateLimit) onRateLimitUpdate(err.rateLimit);
      setColumns((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], error: err.message, loading: false };
        return next;
      });
    }
  };

  const bothLoaded = columns[0].user && columns[0].repos && columns[1].user && columns[1].repos;

  let score1, score2;
  if (bothLoaded) {
    score1 = calculateScore(columns[0].user, columns[0].repos);
    score2 = calculateScore(columns[1].user, columns[1].repos);
  }

  return (
    <div className="compare-view">
      <div className="compare-view__columns">
        {columns.map((col, i) => (
          <CompareColumn
            key={i}
            index={i}
            state={col}
            onSearch={handleSearch}
            onUsernameChange={handleUsernameChange}
          />
        ))}
      </div>

      {bothLoaded && (
        <div className="compare-view__results fade-in">
          <div className="card compare-view__comparison">
            <h3 className="compare-view__comparison-title">
              <FiTrendingUp /> Head to Head
            </h3>
            <CompareRow
              label="Followers"
              val1={columns[0].user.followers}
              val2={columns[1].user.followers}
            />
            <CompareRow
              label="Public Repos"
              val1={columns[0].user.public_repos}
              val2={columns[1].user.public_repos}
            />
            <CompareRow
              label="Total Stars"
              val1={columns[0].repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)}
              val2={columns[1].repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)}
            />
            <CompareRow
              label="Total Forks"
              val1={columns[0].repos.reduce((s, r) => s + (r.forks_count || 0), 0)}
              val2={columns[1].repos.reduce((s, r) => s + (r.forks_count || 0), 0)}
            />
            <CompareRow
              label="Following"
              val1={columns[0].user.following}
              val2={columns[1].user.following}
            />
            <CompareRow
              label="Developer Score"
              val1={score1.total}
              val2={score2.total}
            />
          </div>

          <div className="card compare-view__winner">
            <FiAward className="compare-view__winner-icon" />
            {score1.total === score2.total ? (
              <>
                <h3 className="compare-view__winner-title compare-view__winner-title--tie">It&apos;s a Tie!</h3>
                <p className="compare-view__winner-desc">
                  Both developers scored {score1.total}/100 — equally matched!
                </p>
              </>
            ) : (
              <>
                <h3 className="compare-view__winner-title">
                  🏆 {score1.total > score2.total
                    ? columns[0].user.name || columns[0].user.login
                    : columns[1].user.name || columns[1].user.login} Wins!
                </h3>
                <p className="compare-view__winner-desc">
                  {score1.total > score2.total
                    ? `${columns[0].user.login} scored ${score1.total} vs ${columns[1].user.login}'s ${score2.total}`
                    : `${columns[1].user.login} scored ${score2.total} vs ${columns[0].user.login}'s ${score1.total}`
                  }
                  {' '}— {getScoreLabel(Math.max(score1.total, score2.total))} level!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareView;
