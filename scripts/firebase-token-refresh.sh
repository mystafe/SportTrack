#!/bin/bash

# Firebase Token Refresh Script
# Bu script Firebase token'ını otomatik olarak yeniler

echo "🔄 Firebase token yenileniyor..."

# Firebase CLI'yi güncelle
npm install -g firebase-tools@latest

# Mevcut token'ı kontrol et
TOKEN_FILE="$HOME/.config/configstore/firebase-tools.json"

if [ -f "$TOKEN_FILE" ]; then
    echo "✅ Token dosyası bulundu"
    
    # Token'ın expire olup olmadığını kontrol et
    EXPIRES_AT=$(cat "$TOKEN_FILE" | grep -o '"expires_at":[0-9]*' | grep -o '[0-9]*')
    CURRENT_TIME=$(date +%s)000
    
    if [ -n "$EXPIRES_AT" ] && [ "$EXPIRES_AT" -gt "$CURRENT_TIME" ]; then
        HOURS_LEFT=$(( ($EXPIRES_AT - $CURRENT_TIME) / 3600000 ))
        echo "✅ Token hala geçerli ($HOURS_LEFT saat kaldı)"
    else
        echo "⚠️  Token expire olmuş, yenileniyor..."
        firebase login --reauth
    fi
else
    echo "⚠️  Token dosyası bulunamadı, login yapılıyor..."
    firebase login
fi

echo "✅ Firebase authentication hazır!"

