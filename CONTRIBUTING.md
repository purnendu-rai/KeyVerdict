# Contributing to KeyVerdict

Thank you for your interest in contributing to KeyVerdict! We welcome community contributions, bug reports, and improvements.

## Core Security & Privacy Rule

**KeyVerdict operates under a strict Zero-Knowledge privacy model:**
1. Passwords, hashes, tokens, salt, or generated secrets **must never** be transmitted across the network, sent in query params, logged to servers, or written to persistent storage (`localStorage`, `sessionStorage`, or cookies).
2. The backend is an educational and health metadata provider only. It does not accept request bodies and must never contain password processing logic.
3. Any changes affecting input handlers or network communication must include privacy tests demonstrating that synthetic test strings are never leaked.

## Development Workflow

### Prerequisites
- Node.js 22 LTS (specified in `.nvmrc`)
- npm 10+

### Setting Up

```bash
# Clone your fork
git clone https://github.com/<your-username>/KeyVerdict.git
cd KeyVerdict

# Install frontend dependencies
cd frontend
npm ci

# Install backend dependencies
cd ../backend
npm ci
```

### Running Locally

In separate terminal tabs:

```bash
# Frontend (http://localhost:5173)
cd frontend
npm run dev

# Backend (http://localhost:3000)
cd backend
npm run dev
```

### Running Tests & Linting

Before submitting a Pull Request, ensure all checks pass:

```bash
# Frontend checks
cd frontend
npm run lint
npm test -- --run
npm run build

# Backend checks
cd ../backend
npm run lint
npm test -- --run
```

## Pull Request Guidelines

1. **Keep PRs focused:** Submit distinct pull requests for unrelated features or bug fixes.
2. **Include tests:** If you add a feature or fix a bug, include unit tests or privacy contract tests.
3. **No sensitive data:** Never include real credentials, passwords, or personal API keys in commits, issues, or PR descriptions. Use synthetic markers (e.g., `SYNTHETIC-TEST-MARKER`).
4. **Follow CI standards:** Pull requests must pass GitHub Actions CI checks (`npm run lint`, `npm test`, `npm run build`, and `npm audit --audit-level=high`).
