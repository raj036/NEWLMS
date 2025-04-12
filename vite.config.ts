import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import compression from "vite-plugin-compression"; // Import the compression plugin

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000, // Increase the limit to 2000kB
  },
  plugins: [
    tsconfigPaths(),
    react(),
    compression({
      // Add the compression plugin here
      verbose: true, // Print logs when compression happens
      disable: false, // Disable the plugin during development
      threshold: 10240, // Only compress files larger than this threshold (in bytes)
      algorithm: "gzip", // Choose the compression algorithm
      ext: ".gz", // Extension to append to compressed files
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
