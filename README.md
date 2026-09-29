# Desafío técnico QA Automation – Cypress

Repositorio con los dos desafíos. Cada carpeta es un proyecto Cypress **independiente**, con sus propias dependencias, scripts y README.

| Carpeta | Desafío | README |
|---|---|---|
| [`api-fakestore/`](api-fakestore/) | 1. API Testing – Fake Store API | [api-fakestore/README.md](api-fakestore/README.md) |
| [`ui-saucedemo/`](ui-saucedemo/) | 2. Automatización E2E UI – Sauce Demo | [ui-saucedemo/README.md](ui-saucedemo/README.md) |

## Requisitos
- Node.js 22 o superior (lo exige Cypress 16)
- npm

## Ejecución rápida
```bash
git clone https://github.com/Yanina2021/saucedemo-cypress.git
cd saucedemo-cypress

# API (antes, configurar credenciales: ver api-fakestore/README.md)
cd api-fakestore
npm install
npm test

# UI
cd ../ui-saucedemo
npm install
npm test
```

## Por qué dos proyectos separados en un mismo repo
Las suites prueban sistemas distintos (una API y una web), con otra `baseUrl`, otra configuración y otras dependencias. Separarlas permite correr, mantener y evaluar cada una por su cuenta, sin que un cambio en una afecte a la otra.
