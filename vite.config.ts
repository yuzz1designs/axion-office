import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { handleAivaApi } from './src/server/aivaApi';
import { handleGoogleSheetsApi } from './src/server/googleSheetsApi';

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), 'OPENAI_');
  const googleEnv = loadEnv(mode, process.cwd(), 'GOOGLE_');
  Object.assign(process.env, serverEnv, googleEnv);
  return {
    publicDir: 'assets',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'aiva-secure-api',
        configureServer(server) {
          server.middlewares.use((req, res, next) => void handleAivaApi(req, res, next));
          server.middlewares.use((req, res, next) => void handleGoogleSheetsApi(req, res, next));
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
