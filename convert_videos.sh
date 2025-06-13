#!/bin/bash

# Criar diretórios necessários
mkdir -p converted_videos thumbnails

# Converter cada vídeo MOV para MP4 e extrair thumbnail
for video in video/*.mov video/*.MOV; do
    if [ -f "$video" ]; then
        # Obter nome do arquivo sem extensão e caminho
        filename=$(basename "$video")
        name_no_ext="${filename%.*}"
        
        echo "Convertendo $filename para MP4..."
        
        # Converter para MP4 com compressão otimizada
        ffmpeg -i "$video" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "converted_videos/${name_no_ext}.mp4"
        
        echo "Extraindo thumbnail para $filename..."
        
        # Extrair frame do meio do vídeo como thumbnail
        ffmpeg -i "$video" -ss 00:00:01 -frames:v 1 "thumbnails/${name_no_ext}.jpg"
    fi
done

echo "Conversão concluída!" 