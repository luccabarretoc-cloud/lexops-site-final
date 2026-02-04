# 🚀 Guia de Otimização Mobile - LexOps Site

## 1. OTIMIZAR VÍDEO (Impacto ALTO)
O vídeo `demo.mp4` é o maior culpado. Fazer isto:

### Comprimir o vídeo:
```bash
# Instalar FFmpeg
# Depois rodar:
ffmpeg -i demo.mp4 -vf scale=1280:-1 -b:v 500k -b:a 128k demo.mp4
```

### Alternativa: Usar vídeo adaptativo com múltiplas resoluções
```html
<video controls autoPlay muted loop playsInline>
  <source src="/demo-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
  <source src="/demo.mp4" type="video/mp4" />
</video>
```

---

## 2. LAZY LOADING DO VÍDEO (Impacto ALTO)
Não carregar vídeo automaticamente em mobile:

```jsx
// Substituir em App.jsx - VIDEO SHOWCASE section:
const [videoLoaded, setVideoLoaded] = useState(false);

<video 
  className="w-full h-full object-cover"
  controls 
  autoPlay={videoLoaded} // ← Só auto-play se visível
  muted 
  loop 
  playsInline
  onPlay={() => setVideoLoaded(true)}
>
  <source src="/demo.mp4" type="video/mp4" />
</video>
```

---

## 3. LAZY LOADING DE IMAGENS (Impacto MÉDIO)
Adicionar atributo nativo no navegador:

```jsx
<img 
  src="/logo-lexops.jpg" 
  alt="LexOps Insight"
  loading="lazy" // ← Adicionar isto
  className="h-10 w-auto rounded-lg"
/>
```

---

## 4. WEBP COM FALLBACK (Impacto MÉDIO)
Imagens mais comprimidas:

```jsx
<picture>
  <source srcSet="/logo-lexops.webp" type="image/webp" />
  <img 
    src="/logo-lexops.jpg" 
    alt="LexOps Insight"
    loading="lazy"
  />
</picture>
```

Converter PNG/JPG para WEBP:
```bash
# Linux/Mac
cwebp -q 80 logo-lexops.jpg -o logo-lexops.webp

# Windows (usar online: https://convertio.co/webp-converter/)
```

---

## 5. REDUZIR ANIMAÇÕES CSS EM MOBILE (Impacto MÉDIO)
Mobile reduz frame rate com muitos blurs. Usar media query:

```jsx
// Reduzir blur em mobile (substituir background glows)
<div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

// Mostrar versão leve em mobile
<div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-violet-600/10 blur-[60px] rounded-full opacity-30 pointer-events-none" />
```

---

## 6. PRELOAD CRÍTICO (Impacto BAIXO)
Adicionar no `index.html`:

```html
<link rel="preload" as="image" href="/logo-lexops.jpg" />
<link rel="preconnect" href="https://chk.eduzz.com" />
<link rel="dns-prefetch" href="https://app.lexopsinsight.com.br" />
```

---

## 7. REMOVER / DEFER LUCIDE ICONS NÃO USADOS (Impacto BAIXO)
Você importa 18 ícones mas usa ~10. Remover os não usados:

```jsx
// REMOVER ESTES se não usar:
// - ExternalLink (não vejo uso)
// - AlertTriangle (não vejo uso)
```

---

## 8. OTIMIZAR BUILD (Impacto ALTO)
Se estiver usando Vite, adicionar ao `vite.config.js`:

```js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide': ['lucide-react'],
        }
      }
    },
    minify: 'terser', // Minificação agressiva
    sourcemap: false  // Remover sourcemaps
  }
}
```

Se for Create React App:
```bash
GENERATE_SOURCEMAP=false npm run build
```

---

## 9. CACHE NO NAVEGADOR (Impacto ALTO)
Adicionar headers `.htaccess` (Apache) ou nginx config:

```apache
<FilesMatch "\.(jpg|jpeg|png|gif|webp|mp4)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

<FilesMatch "\.(js|css)$">
  Header set Cache-Control "max-age=2592000, public"
</FilesMatch>
```

---

## 10. DESABILITAR AUTOPLAY EM MOBILE (Impacto ALTO)
O vídeo auto-play consome dados móveis:

```jsx
const isMobile = window.innerWidth < 768;

<video 
  autoPlay={!isMobile}  // ← Só auto-play em desktop
  muted 
  loop 
  playsInline
/>
```

---

## 📊 Prioridades de Implementação:

1. **URGENTE**: Comprimir vídeo + Lazy load vídeo (ganho ~500KB)
2. **IMPORTANTE**: Lazy load imagens + WEBP (ganho ~100KB)
3. **IMPORTANTE**: Desabilitar autoplay em mobile
4. **MÉDIO**: Reduzir animações CSS em mobile
5. **BAIXO**: Otimizar build e cache

---

## 🧪 Testar:

```bash
# Chrome DevTools → Network → Throttle to "Slow 4G"
# Ou usar: https://tools.pingdom.com/
```

**Tempo esperado ANTES**: ~8-15s no mobile  
**Tempo esperado DEPOIS**: ~2-4s no mobile
