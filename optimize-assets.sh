#!/bin/bash
# Script de Otimização de Imagens e Vídeos
# Execute isso na pasta public/ do projeto

echo "🚀 Iniciando otimizações..."

# 1. Comprimir e converter vídeo para mobile
echo "📹 Comprimindo demo.mp4..."
ffmpeg -i demo.mp4 \
  -vf scale=1280:-1 \
  -b:v 500k \
  -b:a 128k \
  -c:v libx264 \
  -crf 28 \
  -movflags +faststart \
  demo-optimized.mp4

echo "✅ Vídeo comprimido: demo-optimized.mp4"

# 2. Criar versão mobile do vídeo (ainda menor)
echo "📱 Criando versão mobile do vídeo..."
ffmpeg -i demo.mp4 \
  -vf scale=854:-1 \
  -b:v 300k \
  -b:a 96k \
  -c:v libx264 \
  -crf 30 \
  -movflags +faststart \
  demo-mobile.mp4

echo "✅ Vídeo mobile criado: demo-mobile.mp4"

# 3. Criar poster frame
echo "🖼️ Criando poster do vídeo..."
ffmpeg -i demo.mp4 -ss 00:00:02 -vframes 1 video-poster.jpg

echo "✅ Poster criado: video-poster.jpg"

# 4. Converter logo para WebP
echo "🎨 Convertendo logo para WebP..."
if command -v cwebp &> /dev/null; then
    cwebp -q 80 logo-lexops.jpg -o logo-lexops.webp
    echo "✅ Logo WebP criado: logo-lexops.webp"
else
    echo "⚠️ cwebp não instalado. Use: https://convertio.co/ para converter manualmente"
fi

# 5. Comprimir JPG original
echo "🗜️ Comprimindo logo JPG..."
if command -v jpegoptim &> /dev/null; then
    jpegoptim --max=80 --strip-all logo-lexops.jpg
    echo "✅ Logo JPG comprimida"
else
    echo "⚠️ jpegoptim não instalado"
fi

echo ""
echo "======================================"
echo "✨ Otimizações Concluídas!"
echo "======================================"
echo ""
echo "Próximos passos:"
echo "1. Substituir demo.mp4 por demo-optimized.mp4"
echo "2. Mover demo-mobile.mp4 para public/"
echo "3. Mover video-poster.jpg para public/"
echo "4. Mover logo-lexops.webp para public/"
echo ""
echo "Tamanho original do vídeo: $(du -h demo.mp4 | cut -f1)"
echo "Tamanho otimizado: $(du -h demo-optimized.mp4 | cut -f1)"
echo "Economia: $(echo "scale=1; (1 - $(stat -c%s demo-optimized.mp4)/$(stat -c%s demo.mp4)) * 100" | bc)%"
