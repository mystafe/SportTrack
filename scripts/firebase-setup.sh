#!/bin/bash

# Firebase Setup Script - Refresh Token ile Login
# Bu script Firebase login yaparken refresh token'ı da kaydeder

echo "🔐 Firebase authentication kurulumu..."
echo ""
echo "Bu script Firebase'e login yapmanızı sağlayacak."
echo "Refresh token'ı kaydedecek böylece her gün login yapmanıza gerek kalmayacak."
echo ""

# Firebase CLI'yi güncelle
echo "📦 Firebase CLI güncelleniyor..."
npm install -g firebase-tools@latest

# Mevcut login'i temizle
echo "🧹 Eski token'lar temizleniyor..."
firebase logout 2>/dev/null || true

# Yeni login (refresh token ile)
echo ""
echo "🌐 Tarayıcı açılacak, lütfen Firebase'e login yapın..."
echo ""

# Login yap (refresh token otomatik kaydedilecek)
firebase login

# Token dosyasını kontrol et
TOKEN_FILE="$HOME/.config/configstore/firebase-tools.json"

if [ -f "$TOKEN_FILE" ]; then
    # Refresh token'ı kontrol et
    HAS_REFRESH=$(cat "$TOKEN_FILE" | grep -o '"refresh_token"' | wc -l)
    
    if [ "$HAS_REFRESH" -gt 0 ]; then
        echo ""
        echo "✅ Başarılı! Refresh token kaydedildi."
        echo "✅ Artık her gün login yapmanıza gerek yok."
        echo ""
        echo "Token bilgileri:"
        cat "$TOKEN_FILE" | grep -E '"expires_at"|"refresh_token"' | head -2
    else
        echo ""
        echo "⚠️  Refresh token kaydedilmedi. Tekrar deneyin:"
        echo "   firebase login --reauth"
    fi
else
    echo ""
    echo "❌ Token dosyası oluşturulamadı."
    echo "   Manuel olarak login yapın: firebase login"
fi

echo ""
echo "✅ Kurulum tamamlandı!"

