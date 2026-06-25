# 🔍 GitHub Profile Analyzer

> Analyze any GitHub profile — view developer scores, stats, language breakdowns, and compare users side by side.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF)
![GitHub API](https://img.shields.io/badge/GitHub-REST_API-181717?logo=github)
![CSS Variables](https://img.shields.io/badge/CSS-Variables-264de4?logo=css3)

🔗 **[Live Demo →](https://github-profile-analyzer-rouge.vercel.app/)**

---

## What It Does

GitHub Profile Analyzer lets you search any GitHub username and instantly see a comprehensive breakdown of their public profile — including followers, stars, forks, account age, top repositories, and language distribution. It calculates a **Developer Score (0-100)** based on a weighted formula covering stars, followers, repos, activity, and profile completeness. You can also **compare two developers side by side** to see who comes out on top across every category, with clear winner/tie indicators and a final verdict.

## Features

- **Profile Search** — Fetch any public GitHub profile with avatar, bio, location, and activity status
- **Developer Score** — Animated circular progress ring with a 6-category breakdown (0-100)
- **Top Repositories** — Top 5 repos by stars with direct links, language badges, and stats
- **Language Chart** — Horizontal bar chart showing percentage breakdown across all repos
- **Compare Mode** — Side-by-side comparison with per-category winner/tie highlighting
- **Dark / Light Mode** — Instant toggle with localStorage persistence and zero flash on reload
- **Fully Responsive** — Mobile-first design that works perfectly from 375px to 4K
- **Rate Limit Indicator** — Live display of remaining GitHub API calls with warning states
- **Error Boundary** — Graceful crash recovery with a styled fallback UI

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/github-profile-analyzer.git
cd github-profile-analyzer

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Deploy to Vercel

```bash
npm run build
# Deploy the dist/ folder to Vercel
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework (functional components, hooks) |
| Vite 6 | Build tool & dev server |
| Recharts | Data visualization (language chart) |
| react-icons | Icon library |
| CSS Variables | Dark/light theming system |
| GitHub REST API | Public profile & repo data (no auth required) |

## License

MIT
