import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url';

// 定義 __dirname (在 ESM 環境中必須手動定義)
const __dirname = fileURLToPath(new URL('.', import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ?'/2026-react-work02/':'/', //設定部署的路徑(儲存庫名稱) or 開發中 
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),   // 首頁
        admin: resolve(__dirname, 'w3.html'), // 第二個頁面
      },
    },
  },
})
