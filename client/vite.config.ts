import { resolve } from "path";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@' : resolve(__dirname, './src')
    },
  },
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
})
