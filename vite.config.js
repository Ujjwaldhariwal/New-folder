import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  darkMode: 'class', // or 'media' or 'class'
  // base: "/BOSCH/",
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()], //CSS support for better cross-browser compatibility
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 4096, // Increase to 1 MB
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },

    server: {
      port: 4000,
      host: true, // optional, allows external network access
    },
  },
});
// GENERATE_SOURCEMAP = true
