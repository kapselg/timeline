import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export const base = '/timeline'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
