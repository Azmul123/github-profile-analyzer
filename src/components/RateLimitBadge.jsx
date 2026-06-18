function RateLimitBadge({ remaining, limit = 60, resetTime }) {
  if (remaining === null || remaining === undefined) return null;

  let badgeClass = 'rate-limit-badge';
  if (remaining <= 0) {
    badgeClass += ' rate-limit-badge--danger';
  } else if (remaining < 10) {
    badgeClass += ' rate-limit-badge--warning';
  }

  const resetStr = resetTime
    ? `Resets at ${resetTime.toLocaleTimeString()}`
    : '';

  return (
    <div className={badgeClass} title={resetStr}>
      <span className="rate-limit-badge__dot" />
      <span className="rate-limit-badge__text">
        API: {remaining}/{limit}
      </span>
    </div>
  );
}

export default RateLimitBadge;
