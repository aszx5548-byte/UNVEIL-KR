import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// public/ 안의 saju · zodiac · birthstone 정적 앱은 Vite가 손대지 않고
// dist/ 로 그대로 복사합니다. 빌드 후 dist 하나에 홈페이지와 3개 앱이 모두 담깁니다.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
