import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["focusfield.infosyscap.net", "www.focusfield.it"],
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
  },
});
