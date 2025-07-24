// vitest.config.ts
    import { defineConfig } from 'vitest/config';
    import react from '@vitejs/plugin-react'; // If using React

    export default defineConfig({
      plugins: [react()], // Include plugins needed for your project
      test: {
        environment: 'jsdom', // Specify the test environment
        // Other test options like setupFiles, include/exclude patterns, etc.
      },
    });