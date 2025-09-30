import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import { VitePWA } from 'vite-plugin-pwa';



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})


// VitePWA({
//     registerType: 'autoUpdate',
//     includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
//     manifest: {
//       name: 'TaskFlow',
//       short_name: 'TaskFlow',
//       description: 'Task management app',
//       theme_color: '#ffffff',
//       icons: [
//         {
//           src: '/logo192.png',
//           sizes: '192x192',
//           type: 'image/png'
//         },
//         {
//           src: '/logo512.png',
//           sizes: '512x512',
//           type: 'image/png'
//         }
//       ]
//     }
//   })