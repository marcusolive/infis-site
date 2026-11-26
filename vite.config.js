import { defineConfig } from 'vite';

// Caminhos relativos para funcionar tanto na raiz de um domínio quanto em /infis-site no GitHub Pages.
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 700 },
});
