import { useMemo } from 'react';
import { FiStar, FiGitBranch } from 'react-icons/fi';

function TopRepos({ repos }) {
  // Use slice() before sort() to avoid mutating the prop array
  const topFive = useMemo(
    () =>
      [...repos]
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 5),
    [repos]
  );

  if (topFive.length === 0) {
    return (
      <div className="card top-repos">
        <h3 className="top-repos__title">Top Repositories</h3>
        <p className="top-repos__empty">No public repositories found.</p>
      </div>
    );
  }

  return (
    <div className="card top-repos">
      <h3 className="top-repos__title">Top Repositories</h3>
      <div className="top-repos__list">
        {topFive.map((repo) => (
          <div className="top-repos__item" key={repo.id}>
            <div className="top-repos__item-header">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="top-repos__item-name"
              >
                {repo.name}
              </a>
              {repo.language && (
                <span className="top-repos__language">{repo.language}</span>
              )}
            </div>
            {repo.description && (
              <p className="top-repos__item-desc">{repo.description}</p>
            )}
            <div className="top-repos__item-stats">
              <span className="top-repos__stat">
                <FiStar /> {(repo.stargazers_count || 0).toLocaleString()}
              </span>
              <span className="top-repos__stat">
                <FiGitBranch /> {(repo.forks_count || 0).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopRepos;
