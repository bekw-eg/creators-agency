import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 1. Конфигурация сборщика Vite для React-приложения
export default defineConfig({
  plugins: [react()],
});
