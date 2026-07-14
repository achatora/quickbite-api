# QuickBite Frontend

React 19 + TypeScript + Vite + Tailwind CSS v4 frontend for the existing QuickBite Go API.

## Run

```bash
npm install
npm run dev
```

The app expects the backend at `http://localhost:8081` by default. Override with:

```bash
VITE_API_BASE_URL=http://localhost:8081
```

## Backend Contract Used

- `GET /menu`
- `GET /orders`
- `POST /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`

The backend currently exposes menu item name, description, price, and availability. It does not expose images, categories, ingredients, allergens, nutrition, modifier groups, taxes, fees, payment, profile, auth, or delivery fields, so the frontend does not fabricate those values.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run format`
