import { FiUsers, FiUserPlus, FiBook, FiStar, FiGitBranch, FiClock } from 'react-icons/fi';

function StatsGrid({ user, repos }) {
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  const createdAt = new Date(user.created_at);
  const now = new Date();
  const years = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24 * 365.25));

  const stats = [
    { icon: <FiUsers />, label: 'Followers', value: user.followers },
    { icon: <FiUserPlus />, label: 'Following', value: user.following },
    { icon: <FiBook />, label: 'Public Repos', value: user.public_repos },
    { icon: <FiStar />, label: 'Total Stars', value: totalStars },
    { icon: <FiGitBranch />, label: 'Total Forks', value: totalForks },
    { icon: <FiClock />, label: 'Account Age', value: `${years}y` },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="card stats-grid__card" key={stat.label}>
          <div className="stats-grid__icon">{stat.icon}</div>
          <div className="stats-grid__value">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</div>
          <div className="stats-grid__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
