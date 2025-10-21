import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/soduko/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'sudoku-icon.svg', 'mask-icon.svg'],
      manifest: {
        name: 'Sudoku für ein klares Denken',
        short_name: 'Sudoku',
        description: 'Seniorenfreundliches Sudoku mit täglichen Rätseln und hoher Barrierefreiheit.',
        theme_color: '#4f5dff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        lang: 'de-DE',
        icons: [
          {
            src: 'sudoku-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'mask-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
