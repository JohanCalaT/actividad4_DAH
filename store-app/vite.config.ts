import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: [path.resolve(__dirname, 'src/test-setup.ts')],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    reporters: ['default', ['json', { outputFile: 'test_results.json' }]],
    server: {
      deps: {
        inline: [
          '@angular/fire', 'firebase', 'rxfire', '@angular/core', '@angular/common',
          '@angular/platform-browser', 'rxfire/auth', 'rxfire/firestore',
          '@ionic/angular', '@ionic/angular/standalone', 'ionicons'
        ],
      },
    },
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/app/core'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@features': path.resolve(__dirname, 'src/app/features'),
      '@env': path.resolve(__dirname, 'src/environments'),
    },
  },
});
