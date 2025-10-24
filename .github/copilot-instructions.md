## Repo snapshot — what this project is

This is a small Express + MongoDB backend for a café menu app ("Norra Café"). Key parts:

- `server.js` — app entry: loads env, creates `uploads` folder, connects to MongoDB, mounts routes at `/api` and serves `uploads` statically.
- `src/routes/authed.js` — authentication endpoints (admin login at `POST /api/login`) and a protected example route.
- `src/routes/menu.js` — CRUD for menu items (protected create/update/delete). Uses `multer` to store uploaded images in the project `uploads/` folder.
- `src/middleware/auth.js` — JWT verify middleware used as `verify` in protected routes.
- `src/models/Menu.js` and `src/models/User.js` — Mongoose models. `Menu` is the domain model for menu items.

## Quick environment & run notes

- Required env vars (used verbatim in the code):
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET_Key` — JWT secret used by `auth.js` and `authed.js`
  - `ADMIN_USER`, `ADMIN_PASS` — admin credentials (defaults present if omitted)
  - optional: `PORT`

- Start commands (see `package.json`):
  - `npm start` — run `node server.js`
  - `npm run serve` — run `nodemon server.js` for development

Create a simple `.env` for local dev (example):

```
MONGO_URI=mongodb://localhost:27017/norra
JWT_SECRET_Key=your_secret_here
ADMIN_USER=admin
ADMIN_PASS=admin123
PORT=3000
```

## Key patterns and conventions agents should follow

- Routing: all routes are mounted under `/api`. Keep new routes under `src/routes` and export a router. Example file locations: `src/routes/menu.js`.
- Protected endpoints: use the middleware exported from `src/middleware/auth.js`. Routes that modify data (POST/PUT/DELETE) use this middleware. Follow the existing pattern: `router.post('/menu', verify, ...)`.
- File uploads: `src/routes/menu.js` uses `multer.diskStorage` and saves files to `uploads/` at project root. The field name for uploads is `image` (multipart form field). Saved files are returned as `imageUrl: /uploads/<filename>` and served statically by Express at `/uploads`.
- Data shapes:
  - MenuItem: { title: String, description: String, price: Number, category: String, imageUrl: String, imageAlt: String, timestamps }
  - User: exists in `src/models/User.js` and hashes passwords, but note: current auth uses ADMIN_USER/ADMIN_PASS from env (not the User model).

## Important gotchas discovered in the codebase (do not change these without confirming intent)

- The project uses `JWT_SECRET_Key` (capitalization + underscore + `Key`). Use that exact env name when reading/writing code.
- There is a `User` model with password hashing (bcrypt). However the active login route in `src/routes/authed.js` currently authenticates against environment admin credentials rather than the `User` collection. If you intend to switch to database-backed admin users, update `authed.js` and ensure migrations or seeds are added.
- `uploads/` is created at server start and served statically; when editing upload behavior be mindful of the disk-backed storage and URL mapping (`/uploads/<filename>`).
- Multer accepts only image/* mimetypes and limits files to 5 MB. Keep these limits consistent when adding new upload endpoints.

## How to add a new protected API endpoint (pattern)

1. Create `src/routes/<feature>.js` and export an Express router.
2. For endpoints that require admin auth, add the `verify` middleware from `src/middleware/auth.js`.
3. If the endpoint accepts files, reuse the multer `storage` pattern in `src/routes/menu.js` or centralize it into a helper.
4. Mount the route in `server.js` under `/api`.

Example small checklist for POST /api/menu (already implemented):
- multipart/form-data with field `image` (optional) and text fields `title`, `price`, `category`, `description`, `imageAlt`.
- include header `Authorization: Bearer <token>` where `<token>` is from `POST /api/login`.

## Minimal examples agents can use when editing or testing

- Login (admin): `POST /api/login` with JSON body { "username": "admin", "password": "admin123" } returns `{ token }`.
- Create menu item (example): multipart POST to `/api/menu` with header `Authorization: Bearer <token>` and field `image` for file. The code uses `image` as the field name and saves to `uploads/`.

## Files to review before major changes

- `server.js` — mounting, static serving and env checks
- `src/routes/menu.js` — multer setup, endpoints, error patterns
- `src/routes/authed.js` — login behavior and JWT creation
- `src/middleware/auth.js` — JWT verification; sets `req.user`
- `src/models/Menu.js` & `src/models/User.js` — data schemas and lifecycle hooks (User pre-save hashing)

## What an agent should not change without confirmation

- Rename or change the env var `JWT_SECRET_Key` or `MONGO_URI` usage (ask human if intended).
- Convert uploads to another storage backend (S3, etc.) without adding configuration and migration for URLs.
- Change authentication model (env-based admin vs DB users) without a plan for credential migration/seed and tests.

---

If anything is unclear or you want me to expand any section (for example, add curl examples with exact headers, or a short dev `README.md`), tell me which part to expand and I will update the file.
