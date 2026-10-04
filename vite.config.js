import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { seo } from './build/seo-plugin.js'

// Warms up the connection to the video/image CDN, using the origin from VITE_CDN_URL.
// No `crossorigin`: posters and videos are plain (non-CORS) requests, which use a different connection pool.
function cdnPreconnect(cdnUrl) {
  return {
    name: 'cdn-preconnect',
    transformIndexHtml() {
      if (!cdnUrl) return []
      const href = new URL(cdnUrl).origin
      return [
        { tag: 'link', attrs: { rel: 'preconnect', href }, injectTo: 'head-prepend' },
        { tag: 'link', attrs: { rel: 'dns-prefetch', href }, injectTo: 'head-prepend' },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue(), cdnPreconnect(env.VITE_CDN_URL), seo(env.VITE_SITE_URL)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
