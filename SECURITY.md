# Security Model & Privacy Policy

## Privacy Boundary

KeyVerdict operates under a strict **Zero-Knowledge privacy architecture**:

- **100% Client-Side Evaluation**: All password scoring, entropy calculation, pattern checks, character variety scoring, and dictionary evaluations execute strictly in the client browser runtime.
- **Zero Secret Transmission**: Passwords, hashes, salts, entropy metrics, or generated tokens are **never** transmitted across the network, included in query parameters, or logged.
- **Zero Local Persistence**: Secrets are stored only in volatile component memory and are never persisted to `localStorage`, `sessionStorage`, browser cookies, or indexed databases.
- **Web Crypto Standard**: Password generation utilizes `window.crypto.getRandomValues()` for cryptographically secure pseudo-random number generation (CSPRNG).

## Optional Backend API Boundary

The optional backend API service serves static public educational guidance and operational health checks only:

- Does not accept request bodies, passwords, hashes, or analytical telemetry.
- Rejects non-GET/HEAD/OPTIONS methods and malformed/lengthy queries.
- Incorporates Helmet security headers, CORS origin enforcement, and in-memory rate limiting.
- Operates independently: if the backend is unavailable or not running, the frontend automatically falls back to bundled offline educational datasets.

## Vulnerability Reporting

If you discover a security vulnerability or privacy flaw in KeyVerdict:

1. **Do not disclose publicly**: Avoid opening public GitHub issues containing actionable vulnerability details.
2. **Contact maintainers privately**: Report reproducible issues directly to the repository maintainers.
3. **Use synthetic data only**: Never provide real credentials, production hashes, or sensitive personal data in test reports or reproduction steps. Use synthetic placeholders (e.g., `SYNTHETIC-TEST-KEY`).
