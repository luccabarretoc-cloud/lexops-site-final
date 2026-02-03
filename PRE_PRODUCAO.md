# ✅ PRÉ-PRODUÇÃO CHECKLIST

## Antes de Deploy

- [x] Build local sem erros: `npm run build` ✓
- [x] Preview funciona: `npm run preview` ✓
- [x] Tamanho do bundle aceitável (<200KB total)
- [x] Skeleton renderiza antes do JS
- [x] Todos os ícones carregam corretamente
- [x] React memoization implementado
- [x] Lazy-load de seções funcionando

## No Servidor (Nginx/Apache)

### 1. Configurar Compressão
```nginx
# /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_types text/css application/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 2. Cache Headers
```nginx
location ~* \.(js|css)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires 1d;
  add_header Cache-Control "public, max-age=86400";
}
```

### 3. Security Headers
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
```

## Testar Performance

### DevTools (Chrome/Edge)
1. Abrir DevTools (F12)
2. Network tab > Throttle para "Fast 3G"
3. Verificar:
   - ✓ Skeleton renderiza em <100ms
   - ✓ First Paint em <1s
   - ✓ TTI em <3s

### Lighthouse
```bash
# CLI
npm install -g @google/web-vitals

# Abrir Chrome > Devtools > Lighthouse
# Ou acessar: https://pagespeed.web.dev/
```

### Real User Monitoring
```javascript
// Adicionar no main.jsx para monitorar Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Monitoramento em Produção

### 1. Google Analytics 4
- Rastrear FCP, LCP, CLS
- Criar alertas se degradar

### 2. Sentry (opcional)
- Monitorar erros de JS
- Rastrear performance

### 3. Logs Custom
```javascript
// Log primeiro render
const now = performance.now();
console.log(`React renderizado em ${now}ms`);
```

## Deploy Steps

### 1. Build final
```bash
npm run build
cd dist/
```

### 2. Copiar para servidor
```bash
scp -r dist/* user@server:/var/www/lexops-site/
```

### 3. Verificar acesso
```bash
curl -I https://lexopsinsight.com.br/
# Deve retornar 200 OK
```

### 4. Testar no mobile
- Abrir em iPhone/Android em conexão 3G
- Verificar skeleton visual
- Confirmar nenhum bloco roxo

## Rollback Plan (se algo der errado)
```bash
# Revert para versão anterior
git checkout HEAD~1
npm run build
# Deploy anterior
```

---

## 🚀 Ready?

Se todos os itens acima ✓, **GO LIVE!**

Aguardar feedback de usuários sobre carregamento. Se tudo OK, celebrar! 🎉
