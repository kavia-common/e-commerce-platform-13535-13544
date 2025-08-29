# e_commerce_frontend Distribution and Deployment Guide

## Introduction

This document describes how to build, package, and deploy the e_commerce_frontend React application, along with the environment variables, expected artifacts, and integration points. It is aimed at DevOps engineers, release managers, and developers preparing production builds.

## Overview

The e_commerce_frontend is a React single page application (SPA) built with Create React App (CRA) and react-router-dom. It communicates with a backend over HTTP(S) using a lightweight API wrapper. Styles are maintained using theme variables in CSS and global utility styles.

- Framework: React 18 (CRA tooling)
- Routing: react-router-dom v6
- Build toolchain: react-scripts
- Distribution artifact: Static assets (HTML, JS, CSS, media) under build/
- Deployment target: Any static file host or CDN (e.g., Nginx, S3+CloudFront, Netlify, Vercel, or containerized Nginx)

## Repository Structure (relevant to distribution)

- package.json: Scripts, runtime and dev dependencies, browserslist
- src/: Application source code
- public/: Provided by CRA template (not listed above but used by react-scripts)
- build/: Generated at build time and contains deployable static assets
- src/services/api.js: API base URL resolution via environment variable
- src/index.js, src/App.js: App bootstrap and routing
- src/theme.css, src/global.css: Theming and base styles

## Environment Variables

Create React App only exposes environment variables prefixed with REACT_APP_ to the browser bundle at build time. The following variables are referenced in the codebase:

- REACT_APP_API_BASE_URL
  - Purpose: Backend API base URL used by the API client.
  - Location of usage: src/services/api.js (BASE_URL)
  - Example: https://api.example.com
  - Required: Yes for production. If omitted, fetch calls use relative paths.

- REACT_APP_SITE_URL
  - Purpose: Public site URL for redirects/integrations (used by deployments or external providers).
  - Location of usage: Referenced in README guidance; not directly used in code. Useful for auth redirects or external integrations if added later.
  - Example: https://shop.example.com
  - Required: Optional

- REACT_APP_PAYMENT_PUBLIC_KEY
  - Purpose: Optional public key for integrating a real payment provider.
  - Location of usage: Currently documented for future integration; Checkout page uses mock input.
  - Example: pk_live_XXXXXXXXXXXXXXXX
  - Required: Optional

Notes:
- Environment variables are compiled into the bundle at build time. Changing them requires a rebuild.
- In CRA-based deployments, you typically set these variables at build time within the CI/CD job.

## Build and Package

### Prerequisites

- Node.js LTS (e.g., 18.x) and npm
- Access to the backend API (for runtime usage) and proper CORS configuration on the server side

### Install dependencies

- npm install

### Development server

- npm start
  - Starts the development server with hot reload at http://localhost:3000
  - Uses variables from a local .env file if present (prefixed with REACT_APP_)

### Production build

- npm run build
  - Generates a production-optimized static site under build/
  - Minifies JS/CSS, fingerprints asset filenames, injects environment variable values

### Build artifacts

The build/ directory contains:
- index.html: SPA entry point
- static/js/*.js: Minified JavaScript bundles
- static/css/*.css: Minified styles
- media assets if any (e.g., images/fonts)

These files are static and can be served by any HTTP server that supports SPA routing.

## Deployment

You can deploy the SPA to a static host, a CDN, or within a container. Common approaches are outlined below.

### 1) Nginx (static hosting)

- Build:
  - REACT_APP_API_BASE_URL="https://api.example.com" npm run build
- Copy build/ into Nginx html directory:
  - /usr/share/nginx/html/
- SPA routing:
  - Configure Nginx to route all unmatched paths to /index.html to support client-side routing.

Sample Nginx location rules:
- location / {
    try_files $uri /index.html;
  }
- Use gzip and caching headers as desired for static assets.

### 2) S3 + CloudFront (static hosting + CDN)

- Build with environment variables.
- Upload the contents of build/ to an S3 bucket configured for static website hosting.
- Front the S3 bucket with CloudFront for CDN caching and custom domains.
- Configure 404 redirection to /index.html so that SPA routes resolve correctly.

### 3) Netlify or Vercel

- Netlify:
  - Build command: npm run build
  - Publish directory: build
  - Add a redirect rule to route all paths to /index.html, e.g., a _redirects file containing:
    - /*  /index.html  200
- Vercel:
  - Use the default static build configuration, serve build/ as the output.

### 4) Dockerized Nginx

- Create a Dockerfile that copies build/ into Nginx and includes SPA routing config. For example:

FROM nginx:stable-alpine
COPY build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

Ensure nginx.conf has try_files $uri /index.html; in the root location.

## Integration with Backend

The frontend communicates with the backend API via fetch in src/services/api.js:
- Base URL resolution:
  - const BASE_URL = process.env.REACT_APP_API_BASE_URL || ''
  - If BASE_URL is empty, requests are made relative to the hosting domain.
- Endpoints used by the app:
  - GET /products (list with optional query params: q, category, minPrice, maxPrice, sort)
  - GET /products/:id
  - POST /auth/login
  - POST /auth/register
  - GET /auth/me (requires Authorization: Bearer <token>)
  - POST /orders (requires Authorization: Bearer <token>)
  - GET /orders (requires Authorization: Bearer <token>)

CORS:
- If the API is on a different origin than the frontend, ensure CORS is enabled on the backend for the frontend origin.

Auth:
- JWT or opaque tokens are stored in localStorage (via src/utils/storage.js).
- The Authorization header is automatically added when a token is provided to API methods that require it.

## SPA Routing Considerations

Because the app uses client-side routing (react-router-dom), the server must serve index.html for any unknown path (e.g., /product/123, /orders). Configure your static host accordingly to avoid 404s on deep links.

## Artifact Structure and Contents

After running npm run build, expect the following structure:

build/
- index.html
- asset-manifest.json (CRA manifest)
- static/
  - js/
    - main.[hash].js
    - chunk.[hash].js
  - css/
    - main.[hash].css
  - media/ (if present)

The exact filenames include content hashes and may vary per build.

## Versioning and Release

- Version is defined in package.json ("version").
- Tag releases in your VCS aligning with the version if you maintain release notes.
- Keep environment-specific configuration in CI variables or build pipelines, not hardcoded.

## Security and Compliance Notes

- Never commit secrets. Only expose public keys in REACT_APP_* variables.
- Tokens are stored in localStorage; consider adding complementary controls (short token TTL, refresh strategies) on the backend.
- Enable HTTPS for all production deployments.
- Configure Content Security Policy (CSP) headers if applicable for your hosting platform.

## Observability

- Frontend errors surface in the browser console. Integrate a telemetry service if desired.
- Backend request failures will display user-friendly messages where implemented and log errors to the console.

## Local Development Workflow

- Set REACT_APP_API_BASE_URL in a local .env (optional) to point at a dev/staging API.
- Run npm start.
- Tests:
  - npm test (uses react-scripts test and setupTests.js which imports @testing-library/jest-dom)
- Lint:
  - ESLint configured via eslint.config.mjs; enforce no-unused-vars and React usage rules.

## Troubleshooting

- Blank page on deep link:
  - Ensure server rewrites unknown paths to /index.html.
- API requests failing with CORS:
  - Configure backend CORS to allow the frontend origin.
- Environment variable not applied:
  - Remember REACT_APP_* variables are injected at build time; rebuild after changing them.
- 404s for assets:
  - Ensure you deploy the entire build/ directory and preserve the directory structure.

## Appendix: Deployment Checklists

Production build checklist:
- [ ] REACT_APP_API_BASE_URL set correctly for production
- [ ] Optional REACT_APP_SITE_URL and REACT_APP_PAYMENT_PUBLIC_KEY configured if needed
- [ ] npm ci or npm install succeeds
- [ ] npm run build completes without errors
- [ ] build/ uploaded and server configured for SPA routing
- [ ] TLS/HTTPS enabled on the domain
- [ ] Backend CORS settings include the production site origin

## Sources

- e_commerce_frontend/package.json (scripts, dependencies)
- e_commerce_frontend/src/services/api.js (base URL, endpoints)
- e_commerce_frontend/src/index.js, src/App.js (bootstrap and routing)
- e_commerce_frontend/src/utils/storage.js (storage approach)
- e_commerce_frontend/README.md (environment variables overview)
