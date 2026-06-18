const BASE_URL = 'https://api.github.com';

const headers = {
  'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
};

/**
 * Parse rate limit info from GitHub API response headers.
 */
export function parseRateLimit(response) {
  return {
    remaining: parseInt(response.headers.get('X-RateLimit-Remaining'), 10),
    limit: parseInt(response.headers.get('X-RateLimit-Limit'), 10),
    resetTime: new Date(parseInt(response.headers.get('X-RateLimit-Reset'), 10) * 1000)
  };
}

/**
 * Fetch a GitHub user profile.
 * Returns { data, rateLimit } or throws an error.
 */
export async function fetchUser(username) {
  const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`, { headers });
  const rateLimit = parseRateLimit(response);

  if (response.status === 404) {
    const err = new Error(`User "${username}" not found`);
    err.rateLimit = rateLimit;
    throw err;
  }
  if (response.status === 403) {
    const resetStr = rateLimit.resetTime
      ? ` Resets at ${rateLimit.resetTime.toLocaleTimeString()}`
      : '';
    const err = new Error(`GitHub API rate limit exceeded.${resetStr}`);
    err.rateLimit = rateLimit;
    throw err;
  }
  if (!response.ok) {
    const err = new Error(`GitHub API error (${response.status})`);
    err.rateLimit = rateLimit;
    throw err;
  }

  const data = await response.json();
  return { data, rateLimit };
}

/**
 * Fetch public repos for a user. Single page, max 100, sorted by stars.
 * Returns { data, rateLimit } or throws an error.
 */
export async function fetchRepos(username) {
  const response = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=stars`,
    { headers }
  );
  const rateLimit = parseRateLimit(response);

  if (response.status === 404) {
    const err = new Error(`Repos for "${username}" not found`);
    err.rateLimit = rateLimit;
    throw err;
  }
  if (response.status === 403) {
    const resetStr = rateLimit.resetTime
      ? ` Resets at ${rateLimit.resetTime.toLocaleTimeString()}`
      : '';
    const err = new Error(`GitHub API rate limit exceeded.${resetStr}`);
    err.rateLimit = rateLimit;
    throw err;
  }
  if (!response.ok) {
    const err = new Error(`GitHub API error (${response.status})`);
    err.rateLimit = rateLimit;
    throw err;
  }

  const data = await response.json();
  return { data, rateLimit };
}
