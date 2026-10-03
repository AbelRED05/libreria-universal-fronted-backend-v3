<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3d3a6511-4320-40ed-8c81-da5d71b23640

## Run Locally

**Prerequisites:** Node.js + PHP/Laravel backend running locally

1. Install frontend dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env` if you want to override the default API URL:
   `VITE_API_URL=http://localhost:8000`
3. Start the Laravel API on port 8000:
   `cd backend && php artisan serve --host=0.0.0.0 --port=8000`
4. Run the frontend:
   `npm run dev`
5. Open the app in the browser at `http://localhost:3000`

The frontend is configured to proxy `/api` requests to the Laravel backend, so the app can consume the REST API without hardcoding the backend URL in every component.

Registration and login in the frontend use Laravel's `/api/v1/auth/register` and `/api/v1/auth/login` endpoints. New registrations are saved as client users in MySQL; admin accounts must already exist in the database. The session token is used for protected API requests and validated again when the page reloads.

The admin inventory uses Laravel's book endpoints to create, update, adjust price/stock, and delete records. Cover images must be supplied as a URL (up to 500 characters); direct file uploads are not persisted by the API yet.
