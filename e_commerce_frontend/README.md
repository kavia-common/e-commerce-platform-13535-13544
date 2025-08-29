# ShopEasy Frontend (React)

Modern, clean, user-friendly e-commerce frontend built with React.

## Features
- Product listing and details
- Search and filter
- User authentication (login/register)
- Add to cart and cart sidebar
- Checkout and basic payment flow (mock)
- Order history
- Responsive design
- Light theme with primary (#1976d2), secondary (#424242), accent (#ffc107)

## Setup
1. Copy `.env.example` to `.env` and set values:
   - `REACT_APP_API_BASE_URL`: Backend API base URL
   - `REACT_APP_SITE_URL`: Public site URL (for redirects)
   - `REACT_APP_PAYMENT_PUBLIC_KEY`: Optional if integrating a provider
2. Install dependencies:
   - `npm install`
3. Run:
   - `npm start`

## Folder Structure
- `src/services/api.js` - HTTP client wrapper
- `src/context` - Auth and Cart contexts
- `src/components` - Layout, shared components, cart, and product UI
- `src/pages` - Route pages (Home, ProductDetails, Login, Register, Checkout, Orders)
- `src/theme.css` / `src/global.css` - Theme variables and base styles

## Backend Integration
- API endpoints (expected):
  - `GET /products`
  - `GET /products/:id`
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/me` (requires Bearer token)
  - `POST /orders` (requires Bearer token)
  - `GET /orders` (requires Bearer token)
- Configure the base URL via `REACT_APP_API_BASE_URL`.

## Notes
- This project intentionally avoids heavy UI frameworks; styles are vanilla CSS.
- Replace the mock payment in Checkout with a real provider as needed using `REACT_APP_PAYMENT_PUBLIC_KEY`.
