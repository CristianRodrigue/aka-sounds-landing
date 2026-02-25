import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const buildVersion = '1.0.1';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: 'cache-bust-plugin',
            transformIndexHtml(html) {
                return html.replace(
                    /(href|src)="(.*?\/assets\/[^"]+\.(js|css))"/g,
                    `$1="$2?v=${buildVersion}"`
                );
            }
        }
    ],
    base: './', // Esto hace que las rutas sean relativas [citation:2][citation:8]
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    },
    server: {
        host: 'localhost',
        port: 5173
    }
})