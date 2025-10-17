#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🎉 JANAZA ADMIN - VÉRIFICATION DU PROJET"
echo "========================================"
echo ""

# Vérifier Node.js
echo "📦 Vérification des prérequis..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✅ pnpm: v$PNPM_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  pnpm n'est pas installé${NC}"
    echo "   Installation: npm install -g pnpm"
    exit 1
fi

echo ""

# Vérifier node_modules
echo "📂 Vérification des dépendances..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules présent${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules manquant${NC}"
    echo "   Exécuter: pnpm install"
    exit 1
fi

echo ""

# Vérifier .env
echo "⚙️  Vérification de la configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Fichier .env présent${NC}"
    if grep -q "VITE_API_URL" .env; then
        API_URL=$(grep VITE_API_URL .env | cut -d '=' -f2)
        echo "   API URL: $API_URL"
    fi
else
    echo -e "${YELLOW}⚠️  Fichier .env manquant${NC}"
    echo "   Copier: cp .env.example .env"
fi

echo ""

# TypeScript Check
echo "🔍 Vérification TypeScript..."
if pnpm type-check &> /dev/null; then
    echo -e "${GREEN}✅ Aucune erreur TypeScript${NC}"
else
    echo -e "${RED}❌ Erreurs TypeScript détectées${NC}"
    echo "   Exécuter: pnpm type-check"
fi

echo ""

# ESLint Check
echo "🔍 Vérification ESLint..."
if pnpm lint &> /dev/null; then
    echo -e "${GREEN}✅ Aucune erreur ESLint${NC}"
else
    echo -e "${RED}❌ Erreurs ESLint détectées${NC}"
    echo "   Exécuter: pnpm lint"
fi

echo ""

# Statistiques
echo "📊 Statistiques du projet:"
TS_FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l)
MD_FILES=$(find . -maxdepth 1 -name "*.md" | wc -l)
COMPONENTS=$(find src/components -type f -name "*.tsx" 2>/dev/null | wc -l)
PAGES=$(find src/pages -type f -name "*.tsx" 2>/dev/null | wc -l)

echo "   - Fichiers TypeScript: $TS_FILES"
echo "   - Composants: $COMPONENTS"
echo "   - Pages: $PAGES"
echo "   - Documentation: $MD_FILES fichiers"

echo ""

# Build Test
echo "🏗️  Test de build..."
if pnpm build &> /tmp/build.log; then
    BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅ Build réussi${NC}"
    echo "   Taille: $BUILD_SIZE"
else
    echo -e "${RED}❌ Échec du build${NC}"
    echo "   Voir: /tmp/build.log"
fi

echo ""
echo "========================================"
echo "🎯 RÉSUMÉ"
echo "========================================"
echo ""
echo "✅ Projet Janaza Admin vérifié"
echo ""
echo "Commandes disponibles:"
echo "  pnpm dev       - Démarrer le serveur de développement"
echo "  pnpm build     - Construire pour la production"
echo "  pnpm preview   - Prévisualiser le build"
echo "  pnpm lint      - Vérifier le code"
echo "  pnpm format    - Formater le code"
echo ""
echo "📚 Documentation: Voir INDEX.md"
echo ""
echo "🚀 Pour démarrer: pnpm dev"
echo ""
