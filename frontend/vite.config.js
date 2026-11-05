import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';
  const normalizedBase = base.startsWith('/') ? base : `/${base}`;
  let apiConnectSource = '';
  if (env.VITE_API_BASE_URL) {
    try {
      const apiUrl = new URL(env.VITE_API_BASE_URL);
      if (['http:', 'https:'].includes(apiUrl.protocol) && !apiUrl.username && !apiUrl.password && !apiUrl.search && !apiUrl.hash && (!apiUrl.pathname || apiUrl.pathname === '/')) {
        apiConnectSource = ` ${apiUrl.origin}`;
      }
    } catch {
      apiConnectSource = '';
    }
  }

  return {
    base: normalizedBase.endsWith('/') ? normalizedBase : `${normalizedBase}/`,
    plugins: [react(), { name: 'inject-api-csp-origin', transformIndexHtml: (html) => html.replace('__API_CONNECT_SRC__', apiConnectSource) }],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
    test: {
      environment: 'jsdom',
      setupFiles: './tests/setup.js',
      globals: true,
      clearMocks: true,
      include: ['tests/**/*.test.{js,jsx}'],
    },
  };
});
