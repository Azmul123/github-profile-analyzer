import { useEffect, useRef, useState, useMemo } from 'react';
import { calculateScore, getScoreLabel, getScoreColor } from '../utils/scoring';

function ScoreCard({ user, repos }) {
  const { total, breakdown } = useMemo(
    () => calculateScore(user, repos),
    [user, repos]
  );
  const label = getScoreLabel(total);
  const color = getScoreColor(total);

  // SVG circle params
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (total / 100) * circumference;

  // Animate stroke-dashoffset on mount only.
  // Use a key-based approach: start with full circumference (empty),
  // then transition to the target after first paint.
  const [offset, setOffset] = useState(circumference);
  const animatedRef = useRef(false);

  useEffect(() => {
    // Reset on every mount (StrictMode remounts in dev)
    setOffset(circumference);
    animatedRef.current = false;

    // Double rAF ensures the browser paints the initial state
    // before the CSS transition triggers
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setOffset(targetOffset);
        animatedRef.current = true;
      });
      // Store raf2 for cleanup
      cleanupRef.current = raf2;
    });

    const cleanupRef = { current: null };

    return () => {
      cancelAnimationFrame(raf1);
      if (cleanupRef.current) cancelAnimationFrame(cleanupRef.current);
    };
  }, [circumference, targetOffset]);

  return (
    <div className="card score-card">
      <h3 className="score-card__title">Developer Score</h3>
      <div className="score-card__ring-container">
        <svg className="score-card__svg" width="180" height="180" viewBox="0 0 180 180">
          <circle
            className="score-card__ring-bg"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            strokeWidth="10"
          />
          <circle
            className="score-card__ring-fill"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              stroke: color,
              transition: animatedRef.current ? 'none' : 'stroke-dashoffset 1000ms ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div className="score-card__ring-label">
          <span className="score-card__score">{total}</span>
          <span className="score-card__score-max">/100</span>
        </div>
      </div>
      <span className="score-card__badge" style={{ backgroundColor: color }}>
        {label}
      </span>
      <div className="score-card__breakdown">
        <h4 className="score-card__breakdown-title">Score Breakdown</h4>
        {breakdown.map((item) => (
          <div className="score-card__breakdown-row" key={item.label}>
            <div className="score-card__breakdown-label">
              <span>{item.label}</span>
              <span>{item.points}/{item.max}</span>
            </div>
            <div className="score-card__breakdown-bar">
              <div
                className="score-card__breakdown-fill"
                style={{
                  width: `${(item.points / item.max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScoreCard;
