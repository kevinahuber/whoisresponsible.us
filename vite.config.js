import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules'],
        silenceDeprecations: ['import', 'slash-div']
      }
    }
  }
})
