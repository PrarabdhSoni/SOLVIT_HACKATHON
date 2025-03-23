import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0',               // Bind to all network interfaces
    port: process.env.PORT || 5173, // Use Render's PORT or fallback to 5173
    open: "/",                      // Open the app after server starts
  },
  plugins: [react()],
});
