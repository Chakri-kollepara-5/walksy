import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Copy mascot image to public folder automatically
const srcMascot = "C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\56f53bdb-fcaf-4f77-bf1f-2720e9f03305\\walksy_mascot_1782453466064.png";
const destMascot = path.resolve(__dirname, "public", "walksy_mascot.png");

try {
  if (fs.existsSync(srcMascot)) {
    fs.copyFileSync(srcMascot, destMascot);
    console.log("✅ Successfully copied mascot to", destMascot);
  } else {
    console.warn("⚠️ Mascot source file not found at:", srcMascot);
  }
} catch (e) {
  console.error("❌ Failed to copy mascot:", e);
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

