# Desafío técnico QA Automation – Cypress

Repositorio con los dos desafíos. Cada carpeta es un proyecto Cypress **independiente**, con sus propias dependencias, scripts y README.

| Carpeta | Desafío | README |
|---|---|---|
| [`api-fakestore/`](api-fakestore/) | 1. API Testing – Fake Store API | [api-fakestore/README.md](api-fakestore/README.md) |
| [`ui-saucedemo/`](ui-saucedemo/) | 2. Automatización E2E UI – Sauce Demo | [ui-saucedemo/README.md](ui-saucedemo/README.md) |

## Requisitos
- Node.js 22 o superior (lo exige Cypress 16).
  Si usan nvm y tienen otra versión (por ejemplo la 20), en la raíz del repo: `nvm install` (instala la 22 si no la tienen) y `nvm use` (la activa). Ambos toman la versión de `.nvmrc`.
  En Windows, nvm-windows no lee `.nvmrc`: usar `nvm install 22` y `nvm use 22`.
- npm

## Ejecución rápida
```bash
git clone https://github.com/Yanina2021/desafioTecnicoSaucedemo.git
cd desafioTecnicoSaucedemo

# API (antes, configurar credenciales: ver api-fakestore/README.md)
cd api-fakestore       # pararse dentro de la carpeta de la API
npm install
npm test

# UI
cd ../ui-saucedemo     # pararse dentro de la carpeta de la UI
npm install
npm test
```

## Por qué dos proyectos separados en un mismo repo
Las suites prueban sistemas distintos (una API y una web), con otra `baseUrl`, otra configuración y otras dependencias. Separarlas permite correr, mantener y evaluar cada una por su cuenta, sin que un cambio en una afecte a la otra.
