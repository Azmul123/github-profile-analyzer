/**
 * Calculate Developer Score (0-100) from user profile and repos.
 * Returns { total, breakdown } where breakdown is an array of { label, points, max }.
 */
export function calculateScore(user, repos) {
  // Total stars across all repos
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  // Account age in years
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const years = (now - createdAt) / (1000 * 60 * 60 * 24 * 365.25);

  // Activity: check most recent push across all repos
  const mostRecentPush = repos.reduce((latest, r) => {
    if (!r.pushed_at) return latest;
    const pushed = new Date(r.pushed_at);
    return pushed > latest ? pushed : latest;
  }, new Date(0));

  const daysSincePush = (now - mostRecentPush) / (1000 * 60 * 60 * 24);

  // Calculate each category
  const starsScore = Math.min(Math.floor(totalStars / 5), 25);
  const followersScore = Math.min(Math.floor(user.followers / 4), 20);
  const reposScore = Math.min(Math.floor(user.public_repos / 2), 20);
  const ageScore = Math.min(Math.floor(years * 3), 15);

  let activityScore = 0;
  if (repos.length > 0) {
    if (daysSincePush <= 30) activityScore = 10;
    else if (daysSincePush <= 90) activityScore = 5;
  }

  let bioScore = 0;
  if (user.bio) bioScore += 5;
  if (user.location) bioScore += 5;

  const breakdown = [
    { label: 'Stars', points: starsScore, max: 25 },
    { label: 'Followers', points: followersScore, max: 20 },
    { label: 'Repos', points: reposScore, max: 20 },
    { label: 'Account Age', points: ageScore, max: 15 },
    { label: 'Activity', points: activityScore, max: 10 },
    { label: 'Bio & Location', points: bioScore, max: 10 },
  ];

  const total = breakdown.reduce((sum, b) => sum + b.points, 0);

  return { total: Math.min(total, 100), breakdown };
}

/**
 * Get a human-readable label for a score.
 */
export function getScoreLabel(score) {
  if (score <= 40) return 'Beginner';
  if (score <= 60) return 'Intermediate';
  if (score <= 80) return 'Advanced';
  return 'Elite';
}

/**
 * Get the color associated with a score label.
 */
export function getScoreColor(score) {
  if (score <= 40) return '#64748b';
  if (score <= 60) return '#f59e0b';
  if (score <= 80) return '#3b82f6';
  return '#8b5cf6';
}

/**
 * Determine activity status from repos.
 * Returns { status: string, daysSincePush: number }
 */
export function getActivityStatus(repos) {
  if (!repos || repos.length === 0) {
    return { status: 'No repos', daysSincePush: Infinity };
  }

  const now = new Date();
  const mostRecentPush = repos.reduce((latest, r) => {
    if (!r.pushed_at) return latest;
    const pushed = new Date(r.pushed_at);
    return pushed > latest ? pushed : latest;
  }, new Date(0));

  const daysSincePush = (now - mostRecentPush) / (1000 * 60 * 60 * 24);

  if (daysSincePush <= 30) return { status: 'Active', daysSincePush };
  if (daysSincePush <= 90) return { status: 'Moderate', daysSincePush };
  return { status: 'Inactive', daysSincePush };
}
