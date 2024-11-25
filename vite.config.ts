import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ReactDateRange',
      fileName: (format) => `react-date-range.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: './tsconfig.json',
    },
  },
  resolve: {
    alias: {
      '@react-date-range/components': '/src/components',
      '@react-date-range/utils': '/src/utils',
      '@react-date-range/styles': '/src/styles',
      '@react-date-range/types': '/src/types',
    },
  },
});
