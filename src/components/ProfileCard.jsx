import { FiMapPin, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { getActivityStatus } from '../utils/scoring';

function ProfileCard({ user, repos }) {
  const activity = getActivityStatus(repos);
  const createdDate = new Date(user.created_at);
  const now = new Date();
  const years = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24 * 365.25));

  let activityClass = 'profile-card__activity-badge';
  if (activity.status === 'Active') activityClass += ' profile-card__activity-badge--active';
  else if (activity.status === 'Moderate') activityClass += ' profile-card__activity-badge--moderate';
  else activityClass += ' profile-card__activity-badge--inactive';

  return (
    <div className="card profile-card">
      <div className="profile-card__header">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="profile-card__avatar"
          width="120"
          height="120"
        />
        <div className="profile-card__info">
          <h2 className="profile-card__name">{user.name || user.login}</h2>
          <p className="profile-card__username">@{user.login}</p>
          {user.bio && <p className="profile-card__bio">{user.bio}</p>}
          <div className="profile-card__meta">
            {user.location && (
              <span className="profile-card__meta-item">
                <FiMapPin /> {user.location}
              </span>
            )}
            <span className="profile-card__meta-item">
              <FiCalendar /> Joined {createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} ({years}y)
            </span>
          </div>
          <div className="profile-card__badges">
            <span className={activityClass}>{activity.status}</span>
          </div>
        </div>
      </div>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="profile-card__github-link"
      >
        <FiExternalLink /> View on GitHub
      </a>
    </div>
  );
}

export default ProfileCard;
