<!-- CHECKLIST DE PERFORMANCE MOBILE -->

# 📋 Checklist de Otimização Mobile - LexOps

## ✅ Feito no Código:
- [x] Remover imports de ícones não usados (AlertTriangle, PlayCircle, ExternalLink)
- [x] Adicionar `loading="lazy"` em imagens
- [x] Desabilitar `autoPlay` em vídeos no mobile
- [x] Reduzir blur CSS em mobile (60px → 30px)
- [x] Adicionar estado de detecção mobile com `useMemo`
- [x] Adicionar poster ao vídeo (carrega frame antes)

## 🎬 Próximas Ações - ASSETS:

### 1. Comprimir o Vídeo (CRÍTICO - +50% de melhoria)
```bash
# Instale FFmpeg primeiro
# Windows: https://ffmpeg.org/download.html
# Mac: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg

# Depois execute:
ffmpeg -i public/demo.mp4 -vf scale=1280:-1 -b:v 500k -b:a 128k public/demo.mp4
```

**Tamanho esperado:**
- Antes: ~50-100 MB
- Depois: ~10-20 MB

### 2. Converter Logo para WebP
```bash
# Instale cwebp
# https://developers.google.com/speed/webp/download

cwebp -q 80 public/logo-lexops.jpg -o public/logo-lexops.webp
```

### 3. Criar Poster do Vídeo
```bash
ffmpeg -i public/demo.mp4 -ss 00:00:02 -vframes 1 public/video-poster.jpg
```

### 4. Otimizar Build (package.json)
```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite-plugin-compression": "^0.5.1"
  }
}
```

---

## 🧪 Testes de Performance

### Google Chrome DevTools:
1. Abra DevTools (F12)
2. Network → Throttle para "Slow 4G"
3. Limpe cache (Ctrl + Shift + Del)
4. Recarregue a página
5. Veja o tempo total de carregamento

**Tempo aceitável:**
- Desktop: < 2s
- Mobile: 2-4s (com WiFi), 4-8s (com 4G)

### Ferramentas Online:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [Pingdom](https://tools.pingdom.com/)

---

## 📊 Métricas Importantes (Web Vitals):

1. **LCP (Largest Contentful Paint)** ← Quando vê o conteúdo principal
   - Alvo: < 2.5s
   
2. **FID (First Input Delay)** ← Resposta ao clique
   - Alvo: < 100ms
   
3. **CLS (Cumulative Layout Shift)** ← Mudanças visuais inesperadas
   - Alvo: < 0.1

---

## 🔍 Problemas Comuns & Soluções:

### "Vídeo ainda está muito grande"
→ Reduzir bitrate ainda mais: `-b:v 300k` em vez de `500k`

### "Imagens estão pixeladas"
→ Aumentar qualidade webp: `-q 90` em vez de `80`

### "Ainda lento no mobile com 4G"
→ Considerar remover vídeo em mobile muito lento, usar GIF animado

### "CSS animations ainda lentas"
→ Usar `transform: translateZ(0)` para ativar GPU acceleration

```css
.animacao {
  animation: fadeIn 0.3s ease-out;
  will-change: opacity;
  transform: translateZ(0);
}
```

---

## 📱 Testar em Dispositivos Reais:

1. Build para produção: `npm run build`
2. Deploy em staging
3. Acessar pelo celular (4G/WiFi)
4. Medir com Chrome DevTools Mobile
5. Tomar tempo com cronômetro real

---

## 🎯 Meta Final:
**Tempo de carregamento do site inteiro: < 3 segundos no mobile**

Sem isto, a taxa de bounce aumenta exponencialmente e você perde conversões.

---

## ⚠️ IMPORTANTE:
Se estiver usando `create-react-app`, adicione ao `.env`:
```
GENERATE_SOURCEMAP=false
REACT_APP_LOG_LEVEL=error
```

Se estiver usando **Vite**, o vite.config.js já tem as otimizações (veja VITE_CONFIG_TEMPLATE.js)
