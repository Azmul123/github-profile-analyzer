import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_COLORS = [
  '#00d4ff', '#7b2ff7', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="language-chart__tooltip">
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p>{payload[0].value}% ({payload[0].payload.count} repos)</p>
    </div>
  );
}

function LanguageChart({ repos }) {
  const data = useMemo(() => {
    const langCounts = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }, [repos]);

  if (data.length === 0) {
    return (
      <div className="card language-chart">
        <h3 className="language-chart__title">Language Breakdown</h3>
        <p className="language-chart__empty">No language data available.</p>
      </div>
    );
  }

  return (
    <div className="card language-chart">
      <h3 className="language-chart__title">Language Breakdown</h3>
      <div className="language-chart__container">
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--text-primary)', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-glow)' }} />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LanguageChart;
